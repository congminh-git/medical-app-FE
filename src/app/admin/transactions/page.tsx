"use client";

import AdminSideBar from "@/components/adminSideBar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { useAsyncList } from "@react-stately/data";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getAllPaymentTransactions } from "@/services/payment/functions";
import LoadingSpinner from "@/components/LoadingSpinner";

interface paymentTransaction {
  trans_id: string;
  order_id: string;
  request_id: string;
  user_id: number;
  doctor_id: number;
  amount: string;
  method: string;
  status: string;
  created_at: string;
}

interface Column {
  name: string;
  uid: keyof paymentTransaction | "actions";
  sortable?: boolean;
}

export default function AdminpaymentTransactionsPage() {
  const [allpaymentTransactionData, setAllpaymentTransactionData] = useState<
    paymentTransaction[]
  >([]);
  const [allpaymentTransactions, setAllpaymentTransactions] = useState<any[]>(
    []
  );
  const [page, setPage] = useState<number>(1);
  const [searchQueryTransaction, setSearchQueryTransaction] =
    useState<string>("");
  const [searchQueryDoctor, setSearchQueryDoctor] = useState<string>("");
  const [searchQueryPatient, setSearchQueryPatient] = useState<string>("");
  const rowsPerPage = 25;

  const fetchData = async () => {
    const users = await getAllPaymentTransactions();
    setAllpaymentTransactionData((users as paymentTransaction[]) || []);
    const specialties = await getAllPaymentTransactions();
    setAllpaymentTransactions(specialties);
  };

  const list = useAsyncList<paymentTransaction>({
    async load() {
      return { items: allpaymentTransactionData };
    },
  });

  useEffect(() => {
    list.reload();
  }, [allpaymentTransactionData]);

  const filteredData = useMemo(() => {
    let filteredItems = list.items;
    if (searchQueryTransaction) {
      filteredItems = filteredItems.filter((item: paymentTransaction) =>
        item.trans_id.toString().includes(searchQueryTransaction.toString())
      );
    }

    if (searchQueryDoctor) {
      filteredItems = filteredItems.filter((item: paymentTransaction) =>
        item.doctor_id.toString().includes(searchQueryDoctor.toString())
      );
    }

    if (searchQueryPatient) {
      filteredItems = filteredItems.filter((item: paymentTransaction) =>
        item.user_id.toString().includes(searchQueryPatient.toString())
      );
    }

    return filteredItems;
  }, [
    list.items,
    searchQueryTransaction,
    searchQueryDoctor,
    searchQueryPatient,
  ]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    setPage(1);
  }, [searchQueryTransaction]);

  useEffect(() => {
    fetchData();
  }, []);

  const renderpaymentTransactionCell = (
    data: paymentTransaction,
    columnKey: keyof paymentTransaction | "actions"
  ) => {
    const cellValue = columnKey !== "actions" ? data[columnKey] : undefined;
    switch (columnKey) {
      case "created_at":
        const createDate = new Date(cellValue as string);
        return createDate.toLocaleString();
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <div className="flex justify-center gap-4">
              <div className="relative group">
                <button aria-label="Chỉnh sửa">
                  <PencilSquareIcon className="h-5 w-5 text-yellow-500" />
                </button>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Chỉnh sửa
                </span>
              </div>
              <div className="relative group">
                <button aria-label="Xóa">
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </button>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Xóa
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const columns: Column[] = [
    { name: "Transaction ID", uid: "trans_id" },
    { name: "ID bệnh nhân", uid: "user_id" },
    { name: "ID bác sĩ", uid: "doctor_id" },
    { name: "Số tiền", uid: "amount" },
    { name: "Phương thức thanh toán", uid: "method" },
    { name: "Status", uid: "status" },
    { name: "Ngày tạo", uid: "created_at" },
    // { name: "Actions", uid: "actions" },
  ];

  return (
    <>
      <Header />
      <div className="flex items-start w-screen mt-[90px]">
        <AdminSideBar />
        <div className="flex-1 min-h-screen p-8 bg-[#D5DBDB] box-border">
          <div className="w-full min-h-screen border rounded-lg bg-white p-6 box-border">
            <h1 className="text-3xl font-bold ">Lịch sử giao dịch</h1>
            {/* Search Input */}
            <div className="mb-4 flex justify-between items-center">
              <div className="flex justify-start gap-4 items-center">
                <Input
                  placeholder="Tìm kiếm theo tên transaction ID..."
                  value={searchQueryTransaction}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQueryTransaction(e.target.value)
                  }
                  className="w-[260px]"
                />

                <Input
                  placeholder="Tìm kiếm theo tên ID bệnh nhân..."
                  value={searchQueryPatient}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQueryPatient(e.target.value)
                  }
                  className="w-[260px]"
                />

                <Input
                  placeholder="Tìm kiếm theo tên ID bác sĩ..."
                  value={searchQueryDoctor}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQueryDoctor(e.target.value)
                  }
                  className="w-[260px]"
                />
              </div>

              {/* <Button
                color="primary"
                className="w-fit text-lg bg-[#58D68D] text-[#34495E]"
                size="lg"
              >
                Thêm mới
              </Button> */}
            </div>

            {allpaymentTransactionData.length > 0 &&
            allpaymentTransactions.length > 0 ? (
              <>
                <Table
                  isStriped
                  aria-label="paymentTransaction table with pagination and sorting"
                  sortDescriptor={list.sortDescriptor}
                  onSortChange={list.sort}
                >
                  <TableHeader columns={columns}>
                    {(column: Column) => (
                      <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                      >
                        {column.name}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody items={paginatedData}>
                    {(item: paymentTransaction) => (
                      <TableRow key={item.trans_id}>
                        {(columnKey: any) => (
                          <TableCell>
                            {renderpaymentTransactionCell(item, columnKey)}
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-end mt-4">
                  <Pagination
                    className="z-0"
                    total={totalPages}
                    page={page}
                    onChange={setPage}
                    showControls
                    isCompact
                  />
                </div>
              </>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

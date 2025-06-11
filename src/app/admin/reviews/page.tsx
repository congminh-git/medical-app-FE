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
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteReview, getAllReviews } from "@/services/reviews/functions";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { formatDateTime } from "@/services/reUseFunctions";

interface Review {
  id?: string;
  rating: number;
  feedback: string;
  user_id: number;
  doctor_id: number;
  created_at: string;
  formattedDate?: string;
}

interface Column {
  name: string;
  uid: keyof Review | "actions";
  sortable?: boolean;
}

export default function AdminReviewsPage() {
  const [allReviewData, setAllReviewData] = useState<Review[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const rowsPerPage = 25;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const reviews = await getAllReviews();
      setAllReviewData((reviews as Review[]) || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Lỗi khi tải dữ liệu!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const list = useAsyncList<Review>({
    async load() {
      return { items: allReviewData };
    },
  });

  useEffect(() => {
    list.reload();
  }, [allReviewData]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return list.items;
    return list.items.filter(
      (item: Review) =>
        item.feedback?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rating?.toString().includes(searchQuery)
    );
  }, [list.items, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page]);

  const handleDeleteReview = async (reviewId: number) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, xóa đánh giá!",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        await deleteReview(reviewId);
        await fetchData();
        toast.success("Xóa đánh giá thành công!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Xóa đánh giá thất bại!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, []);

  const renderReviewCell = (
    data: Review,
    columnKey: keyof Review | "actions"
  ) => {
    const cellValue = columnKey !== "actions" ? data[columnKey] : undefined;
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <div className="flex justify-center gap-4">
              <div className="relative group">
                <button
                  aria-label="Xóa"
                  onClick={() => handleDeleteReview(Number(data.id))}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );
      case "created_at":
        return formatDateTime(cellValue as string);
      case "rating":
        return `${cellValue}`;
      default:
        return cellValue;
    }
  };

  const columns: Column[] = [
    { name: "ID", uid: "id" },
    { name: "Đánh giá", uid: "rating" },
    { name: "Bình luận", uid: "feedback" },
    { name: "ID Người dùng", uid: "user_id" },
    { name: "ID Bác sĩ", uid: "doctor_id" },
    { name: "Ngày tạo", uid: "created_at", sortable: true },
    { name: "Thao tác", uid: "actions" },
  ];

  return (
    <>
      <Header />
      <div className="flex items-start w-screen mt-[90px]">
        <AdminSideBar />
        <div className="flex-1 min-h-screen p-8 bg-[#D5DBDB] box-border">
          <div className="w-full min-h-screen border rounded-lg bg-white p-6 box-border">
            <h1 className="text-3xl font-bold ">Quản lý đánh giá</h1>
            {/* Search Input */}
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="w-64"
              />
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : paginatedData.length > 0 ? (
              <>
                <Table aria-label="Reviews Table">
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn key={column.uid}>{column.name}</TableColumn>
                    )}
                  </TableHeader>
                  <TableBody items={paginatedData}>
                    {(item) => (
                      <TableRow key={item.id}>
                        {(columnKey) => (
                          <TableCell>
                            {renderReviewCell(
                              item,
                              columnKey as keyof Review | "actions"
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

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
              <div className="text-center py-4">Không có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 
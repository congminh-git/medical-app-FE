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
import { Button } from "@heroui/button";
import { useAsyncList } from "@react-stately/data";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  addDiagnosis,
  deleteDiagnosis,
  getAllDiagnoses,
  updateDiagnosisInfo,
} from "@/services/diagnosis/functions";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

interface Diagnosis {
  id?: string;
  name: string;
  description: string;
}

interface Column {
  name: string;
  uid: keyof Diagnosis | "actions";
  sortable?: boolean;
}

export default function AdminDiagnosisPage() {
  const [allDiagnosisData, setAllDiagnosisData] = useState<Diagnosis[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
  const [newInfo, setNewInfo] = useState<Diagnosis>({
    name: "",
    description: ""
  });
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newDiagnosis, setNewDiagnosis] = useState<Diagnosis>({
    name: "",
    description: ""
  });
  const rowsPerPage = 25;

  const fetchData = async () => {
    try {
      const diagnoses = await getAllDiagnoses();
      setAllDiagnosisData((diagnoses as Diagnosis[]) || []);
    } catch (error) {
      console.error("Error fetching diagnoses:", error);
      toast.error('Lỗi khi tải dữ liệu!', {
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

  const list = useAsyncList<Diagnosis>({
    async load() {
      return { items: allDiagnosisData };
    },
  });

  useEffect(() => {
    list.reload();
  }, [allDiagnosisData]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return list.items;
    return list.items.filter(
      (item: Diagnosis) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [list.items, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page]);

  const handleDeleteDiagnosis = async (diagnosisId: number) => {
    try {
      const result = await Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: "Hành động này không thể hoàn tác!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Có, xóa chuẩn đoán!',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        await deleteDiagnosis(diagnosisId);
        fetchData();
        toast.success('Xóa chuẩn đoán thành công!', {
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
      console.error("Failed to delete diagnosis:", error);
      toast.error('Xóa chuẩn đoán thất bại!', {
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
  
  const handleUpdate = async (id: number) => {
    try {
      const filteredInfo = Object.fromEntries(
        Object.entries(newInfo).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      );
      await updateDiagnosisInfo(id, filteredInfo);
      fetchData();
      setOpenUpdateModal(false);
      setSelectedDiagnosis(null);
      setNewInfo({
        name: "",
        description: ""
      });
      toast.success('Cập nhật chuẩn đoán thành công!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Failed to update diagnosis:", error);
      toast.error('Cập nhật chuẩn đoán thất bại!', {
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
  
  const handleAdd = async () => {
    try {
      await addDiagnosis(newDiagnosis);
      fetchData();
      setOpenAddModal(false);
      setNewDiagnosis({
        name: "",
        description: ""
      });
      toast.success('Thêm chuẩn đoán thành công!', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Failed to add diagnosis:", error);
      toast.error('Thêm chuẩn đoán thất bại!', {
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

  const renderDiagnosisCell = (
    data: Diagnosis,
    columnKey: keyof Diagnosis | "actions"
  ) => {
    const cellValue = columnKey !== "actions" ? data[columnKey] : undefined;
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <div className="flex justify-center gap-4">
              <div className="relative group">
                <button 
                  aria-label="Chỉnh sửa"
                  onClick={() => {
                    setSelectedDiagnosis(data);
                    setNewInfo({
                      name: data.name || "",
                      description: data.description || ""
                    });
                    setOpenUpdateModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="relative group">
                <button 
                  aria-label="Xóa"
                  onClick={() => handleDeleteDiagnosis(Number(data.id))}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const columns: Column[] = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Tên chuẩn đoán", uid: "name", sortable: true },
    { name: "Mô tả", uid: "description" },
    { name: "Thao tác", uid: "actions" },
  ];

  return (
    <>
      <Header />
      <div className="flex items-start w-screen mt-[90px]">
        <AdminSideBar />
        <div className="flex-1 min-h-screen p-8 bg-[#D5DBDB] box-border">
          <div className="w-full min-h-screen border rounded-lg bg-white p-6 box-border">
            <h1 className="text-3xl font-bold ">Quản lý các lựa chọn chuẩn đoán</h1>
            {/* Search Input */}
            <div className="mb-4 flex justify-between items-center">
              <Input
                placeholder="Tìm kiếm theo tên triệu chứng..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="max-w-xs"
              />

              <Button
                color="primary"
                className="w-fit text-lg bg-[#58D68D] text-[#34495E]"
                size="lg"
                onPress={() => setOpenAddModal(true)}
              >
                Thêm mới
              </Button>
            </div>

            {paginatedData.length > 0 ? (
              <>
                <Table aria-label="Diagnosis table">
                  <TableHeader>
                    {columns.map((column) => (
                      <TableColumn key={column.uid}>{column.name}</TableColumn>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        {columns.map((column) => (
                          <TableCell key={column.uid}>
                            {renderDiagnosisCell(item, column.uid)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
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

      {/* Add Modal */}
      <Drawer
        isOpen={openAddModal}
        onClose={() => setOpenAddModal(false)}
        placement="right"
      >
        <DrawerContent>
          <DrawerHeader>Thêm chuẩn đoán mới</DrawerHeader>
          <DrawerBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Tên chuẩn đoán"
                value={newDiagnosis.name}
                onChange={(e) => setNewDiagnosis({ ...newDiagnosis, name: e.target.value })}
              />
              <Input
                label="Mô tả"
                value={newDiagnosis.description}
                onChange={(e) => setNewDiagnosis({ ...newDiagnosis, description: e.target.value })}
              />
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button color="danger" variant="light" onPress={() => setOpenAddModal(false)}>
              Hủy
            </Button>
            <Button color="primary" onPress={handleAdd}>
              Thêm
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Update Modal */}
      <Drawer
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        placement="right"
      >
        <DrawerContent>
          <DrawerHeader>Cập nhật chuẩn đoán</DrawerHeader>
          <DrawerBody>
            <div className="flex flex-col gap-4">
              <Input
                label="Tên chuẩn đoán"
                value={newInfo.name}
                onChange={(e) => setNewInfo({ ...newInfo, name: e.target.value })}
              />
              <Input
                label="Mô tả"
                value={newInfo.description}
                onChange={(e) => setNewInfo({ ...newInfo, description: e.target.value })}
              />
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button color="danger" variant="light" onPress={() => setOpenUpdateModal(false)}>
              Hủy
            </Button>
            <Button color="primary" onPress={() => handleUpdate(Number(selectedDiagnosis?.id))}>
              Cập nhật
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Footer />
    </>
  );
} 
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
  addSymptom,
  deleteSymptom,
  getAllSymptoms,
  updateSymptomInfo,
} from "@/services/symptoms/functions";
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

interface Symptom {
  id?: string;
  name: string;
  description: string;
}

interface Column {
  name: string;
  uid: keyof Symptom | "actions";
  sortable?: boolean;
}

export default function AdminSymptomsPage() {
  const [allSymptomData, setAllSymptomData] = useState<Symptom[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [newInfo, setNewInfo] = useState<Symptom>({
    name: "",
    description: ""
  });
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newSymptom, setNewSymptom] = useState<Symptom>({
    name: "",
    description: ""
  });
  const rowsPerPage = 25;

  const fetchData = async () => {
    try {
      const symptoms = await getAllSymptoms();
      setAllSymptomData((symptoms as Symptom[]) || []);
    } catch (error) {
      console.error("Error fetching symptoms:", error);
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

  const list = useAsyncList<Symptom>({
    async load() {
      return { items: allSymptomData };
    },
  });

  useEffect(() => {
    list.reload();
  }, [allSymptomData]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return list.items;
    return list.items.filter(
      (item: Symptom) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [list.items, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page]);

  const handleDeleteSymptom = async (symptomId: number) => {
    try {
      const result = await Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: "Hành động này không thể hoàn tác!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Có, xóa triệu chứng!',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        await deleteSymptom(symptomId);
        fetchData();
        toast.success('Xóa triệu chứng thành công!', {
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
      console.error("Failed to delete symptom:", error);
      toast.error('Xóa triệu chứng thất bại!', {
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
      await updateSymptomInfo(id, filteredInfo);
      fetchData();
      setOpenUpdateModal(false);
      setSelectedSymptom(null);
      setNewInfo({
        name: "",
        description: ""
      });
      toast.success('Cập nhật triệu chứng thành công!', {
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
      console.error("Failed to update symptom:", error);
      toast.error('Cập nhật triệu chứng thất bại!', {
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
      await addSymptom(newSymptom);
      fetchData();
      setOpenAddModal(false);
      setNewSymptom({
        name: "",
        description: ""
      });
      toast.success('Thêm triệu chứng thành công!', {
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
      console.error("Failed to add symptom:", error);
      toast.error('Thêm triệu chứng thất bại!', {
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

  const renderSymptomCell = (
    data: Symptom,
    columnKey: keyof Symptom | "actions"
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
                    setOpenUpdateModal(true);
                    setSelectedSymptom(data);
                    setNewInfo({
                      name: data.name,
                      description: data.description
                    });
                  }}
                >
                  <PencilSquareIcon className="h-5 w-5 text-yellow-500" />
                </button>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Chỉnh sửa
                </span>
              </div>
              <div className="relative group">
                <button
                  aria-label="Xóa"
                  onClick={() => {
                    handleDeleteSymptom(data.id ? parseInt(data.id) : 0);
                  }}
                >
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
    { name: "ID", uid: "id" },
    { name: "Tên triệu chứng", uid: "name" },
    { name: "Mô tả", uid: "description" },
    { name: "ACTIONS", uid: "actions" },
  ];

  return (
    <>
      <Header />
      <div className="flex items-start w-screen mt-[90px]">
        <AdminSideBar />
        <div className="flex-1 min-h-screen p-8 bg-[#D5DBDB] box-border">
          <div className="w-full min-h-screen border rounded-lg bg-white p-6 box-border">
            <h1 className="text-3xl font-bold ">Quản lý triệu chứng</h1>
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

            {allSymptomData.length > 0 ? (
              <>
                <Table
                  isStriped
                  aria-label="Symptom table with pagination and sorting"
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
                    {(item: Symptom) => (
                      <TableRow key={item.id}>
                        {(columnKey: any) => (
                          <TableCell>
                            {renderSymptomCell(item, columnKey)}
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

      {/* Update Modal */}
      <Drawer
        isOpen={openUpdateModal}
        onClose={() => {
          setOpenUpdateModal(false);
          setSelectedSymptom(null);
          setNewInfo({
            name: "",
            description: ""
          });
        }}
      >
        <DrawerContent>
          <DrawerHeader className="border-b border-default-200">
            <h4 className="text-xl font-bold">Cập nhật triệu chứng</h4>
          </DrawerHeader>
          <DrawerBody>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Tên triệu chứng</label>
                <Input
                  placeholder="Nhập tên triệu chứng"
                  value={newInfo.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewInfo({ ...newInfo, name: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Mô tả</label>
                <Input
                  placeholder="Nhập mô tả"
                  value={newInfo.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewInfo({ ...newInfo, description: e.target.value })
                  }
                />
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                setOpenUpdateModal(false);
                setSelectedSymptom(null);
                setNewInfo({
                  name: "",
                  description: ""
                });
              }}
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={() => {
                if (selectedSymptom?.id) {
                  handleUpdate(parseInt(selectedSymptom.id));
                }
              }}
            >
              Cập nhật
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Add Modal */}
      <Drawer
        isOpen={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          setNewSymptom({
            name: "",
            description: ""
          });
        }}
      >
        <DrawerContent>
          <DrawerHeader className="border-b border-default-200">
            <h4 className="text-xl font-bold">Thêm triệu chứng mới</h4>
          </DrawerHeader>
          <DrawerBody>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Tên triệu chứng</label>
                <Input
                  placeholder="Nhập tên triệu chứng"
                  value={newSymptom.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewSymptom({ ...newSymptom, name: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Mô tả</label>
                <Input
                  placeholder="Nhập mô tả"
                  value={newSymptom.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewSymptom({ ...newSymptom, description: e.target.value })
                  }
                />
              </div>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                setOpenAddModal(false);
                setNewSymptom({
                  name: "",
                  description: ""
                });
              }}
            >
              Hủy
            </Button>
            <Button color="primary" onPress={handleAdd}>
              Thêm mới
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Footer />
    </>
  );
} 
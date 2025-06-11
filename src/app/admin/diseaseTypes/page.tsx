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
  addDiseaseType,
  deleteDiseaseType,
  getAllDiseaseTypes,
  updateDiseaseTypeInfo,
} from "@/services/diseaseTypes/functions";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

interface DiseaseType {
  id?: string;
  name: string;
  description: string;
}

interface Column {
  name: string;
  uid: keyof DiseaseType | "actions";
  sortable?: boolean;
}

export default function AdminDiseaseTypesPage() {
  const [allDiseaseTypeData, setAllDiseaseTypeData] = useState<DiseaseType[]>(
    []
  );
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedDiseaseType, setSelectedDiseaseType] =
    useState<DiseaseType | null>(null);
  const [newInfo, setNewInfo] = useState<DiseaseType>({
    name: "",
    description: "",
  });
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newDiseaseType, setNewDiseaseType] = useState<DiseaseType>({
    name: "",
    description: "",
  });
  const rowsPerPage = 25;

  const fetchData = async () => {
    try {
      const diseaseTypes = await getAllDiseaseTypes();
      setAllDiseaseTypeData((diseaseTypes as DiseaseType[]) || []);
    } catch (error) {
      console.error("Error fetching disease types:", error);
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
    }
  };

  const list = useAsyncList<DiseaseType>({
    async load() {
      return { items: allDiseaseTypeData };
    },
  });

  useEffect(() => {
    list.reload();
  }, [allDiseaseTypeData]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return list.items;
    return list.items.filter(
      (item: DiseaseType) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [list.items, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page]);

  const handleDeleteDiseaseType = async (diseaseTypeId: number) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, xóa loại bệnh!",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        await deleteDiseaseType(diseaseTypeId);
        fetchData();
        toast.success("Xóa loại bệnh thành công!", {
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
      console.error("Failed to delete disease type:", error);
      toast.error("Xóa loại bệnh thất bại!", {
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
      await updateDiseaseTypeInfo(id, filteredInfo);
      fetchData();
      setOpenUpdateModal(false);
      setSelectedDiseaseType(null);
      setNewInfo({
        name: "",
        description: "",
      });
      toast.success("Cập nhật loại bệnh thành công!", {
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
      console.error("Failed to update disease type:", error);
      toast.error("Cập nhật loại bệnh thất bại!", {
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
      await addDiseaseType(newDiseaseType);
      fetchData();
      setOpenAddModal(false);
      setNewDiseaseType({
        name: "",
        description: "",
      });
      toast.success("Thêm loại bệnh thành công!", {
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
      console.error("Failed to add disease type:", error);
      toast.error("Thêm loại bệnh thất bại!", {
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

  const renderDiseaseTypeCell = (
    data: DiseaseType,
    columnKey: keyof DiseaseType | "actions"
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
                    setSelectedDiseaseType(data);
                    setNewInfo({
                      name: data.name,
                      description: data.description,
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
                  onClick={() => handleDeleteDiseaseType(Number(data.id))}
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
    { name: "Tên loại bệnh", uid: "name", sortable: true },
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
            <h1 className="text-3xl font-bold ">Quản lý loại bệnh</h1>
            {/* Search Input */}
            <div className="mb-4 flex justify-between items-center">
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
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
                <Table aria-label="Disease Types Table">
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
                            {renderDiseaseTypeCell(
                              item,
                              columnKey as keyof DiseaseType | "actions"
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
          setSelectedDiseaseType(null);
          setNewInfo({
            name: "",
            description: "",
          });
        }}
      >
        <DrawerContent>
          <DrawerHeader>Chỉnh sửa loại bệnh</DrawerHeader>
          <DrawerBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên loại bệnh
                </label>
                <Input
                  type="text"
                  value={newInfo.name}
                  onChange={(e) =>
                    setNewInfo({ ...newInfo, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <Input
                  type="text"
                  value={newInfo.description}
                  onChange={(e) =>
                    setNewInfo({ ...newInfo, description: e.target.value })
                  }
                  className="mt-1"
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
                setSelectedDiseaseType(null);
                setNewInfo({
                  name: "",
                  description: "",
                });
              }}
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={() => handleUpdate(Number(selectedDiseaseType?.id))}
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
          setNewDiseaseType({
            name: "",
            description: "",
          });
        }}
      >
        <DrawerContent>
          <DrawerHeader>Thêm loại bệnh mới</DrawerHeader>
          <DrawerBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên loại bệnh
                </label>
                <Input
                  type="text"
                  value={newDiseaseType.name}
                  onChange={(e) =>
                    setNewDiseaseType({
                      ...newDiseaseType,
                      name: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <Input
                  type="text"
                  value={newDiseaseType.description}
                  onChange={(e) =>
                    setNewDiseaseType({
                      ...newDiseaseType,
                      description: e.target.value,
                    })
                  }
                  className="mt-1"
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
                setNewDiseaseType({
                  name: "",
                  description: "",
                });
              }}
            >
              Hủy
            </Button>
            <Button color="primary" onPress={handleAdd}>
              Thêm
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Footer />
    </>
  );
}

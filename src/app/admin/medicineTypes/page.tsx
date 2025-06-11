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
  addMedicineType,
  deleteMedicineType,
  getAllMedicineTypes,
  updateMedicineTypeInfo,
} from "@/services/medicineTypes/functions";
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

interface MedicineType {
  id?: string;
  name: string;
  description: string;
}

interface Column {
  name: string;
  uid: keyof MedicineType | "actions";
  sortable?: boolean;
}

export default function AdminMedicineTypesPage() {
  const [allMedicineTypeData, setAllMedicineTypeData] = useState<
    MedicineType[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedMedicineType, setSelectedMedicineType] =
    useState<MedicineType | null>(null);
  const [newInfo, setNewInfo] = useState<MedicineType>({
    name: "",
    description: "",
  });
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newMedicineType, setNewMedicineType] = useState<MedicineType>({
    name: "",
    description: "",
  });
  const rowsPerPage = 25;

  const fetchData = async () => {
    try {
      const medicineTypes = await getAllMedicineTypes();
      setAllMedicineTypeData((medicineTypes as MedicineType[]) || []);
    } catch (error) {
      console.error("Error fetching medicine types:", error);
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

  const list = useAsyncList<MedicineType>({
    async load() {
      return { items: allMedicineTypeData };
    },
  });

  useEffect(() => {
    list.reload();
  }, [allMedicineTypeData]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return list.items;
    return list.items.filter(
      (item: MedicineType) =>
        (item.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        )
    );
  }, [list.items, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page]);

  const handleDeleteMedicineType = async (medicineTypeId: number) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, xóa loại thuốc!",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        await deleteMedicineType(medicineTypeId);
        await fetchData();
        toast.success("Xóa loại thuốc thành công!", {
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
      console.error("Failed to delete medicine type:", error);
      toast.error("Xóa loại thuốc thất bại!", {
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
      await updateMedicineTypeInfo(id, filteredInfo);
      fetchData();
      setOpenUpdateModal(false);
      setSelectedMedicineType(null);
      setNewInfo({
        name: "",
        description: "",
      });
      toast.success("Cập nhật loại thuốc thành công!", {
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
      console.error("Failed to update medicine type:", error);
      toast.error("Cập nhật loại thuốc thất bại!", {
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
      await addMedicineType(newMedicineType);
      fetchData();
      setOpenAddModal(false);
      setNewMedicineType({
        name: "",
        description: "",
      });
      toast.success("Thêm loại thuốc thành công!", {
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
      console.error("Failed to add medicine type:", error);
      toast.error("Thêm loại thuốc thất bại!", {
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

  const renderMedicineTypeCell = (
    data: MedicineType,
    columnKey: keyof MedicineType | "actions"
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
                    setSelectedMedicineType(data);
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
                  onClick={() => handleDeleteMedicineType(Number(data.id))}
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
    { name: "Tên loại thuốc", uid: "name", sortable: true },
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
            <h1 className="text-3xl font-bold ">Quản lý loại thuốc</h1>
            {/* Search Input */}
            <div className="mb-4 flex justify-between items-center">
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onValueChange={setSearchQuery}
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
                <Table aria-label="Medicine Types Table">
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
                            {renderMedicineTypeCell(
                              item,
                              columnKey as keyof MedicineType | "actions"
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
        className="z-10"
        isOpen={openUpdateModal}
        onClose={() => {
          setOpenUpdateModal(false);
          setSelectedMedicineType(null);
          setNewInfo({
            name: "",
            description: "",
          });
        }}
      >
        <DrawerContent>
          <DrawerHeader>Chỉnh sửa loại thuốc</DrawerHeader>
          <DrawerBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên loại thuốc
                </label>
                <Input
                  type="text"
                  value={newInfo.name}
                  onValueChange={(value) =>
                    setNewInfo({ ...newInfo, name: value })
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
                  onValueChange={(value) =>
                    setNewInfo({ ...newInfo, description: value })
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
                setSelectedMedicineType(null);
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
              onPress={() => handleUpdate(Number(selectedMedicineType?.id))}
            >
              Cập nhật
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Add Modal */}
      <Drawer
        className="z-10"
        isOpen={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          setNewMedicineType({
            name: "",
            description: "",
          });
        }}
      >
        <DrawerContent>
          <DrawerHeader>Thêm loại thuốc mới</DrawerHeader>
          <DrawerBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên loại thuốc
                </label>
                <Input
                  type="text"
                  value={newMedicineType.name}
                  onValueChange={(value) =>
                    setNewMedicineType({
                      ...newMedicineType,
                      name: value,
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
                  value={newMedicineType.description}
                  onValueChange={(value) =>
                    setNewMedicineType({
                      ...newMedicineType,
                      description: value,
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
                setNewMedicineType({
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

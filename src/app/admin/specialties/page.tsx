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
  addSpecialtie,
  deleteSpecialtie,
  getAllSpecialties,
  updateSpecialtieInfo,
} from "@/services/specialties/functions";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Specialtie {
  id?: string;
  name: string;
  description: string;
}

interface Column {
  name: string;
  uid: keyof Specialtie | "actions";
  sortable?: boolean;
}

export default function AdminSpecialtiesPage() {
  const [allSpecialtieData, setAllSpecialtieData] = useState<Specialtie[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [selectedSpecialtie, setSelectedSpecialtie] = useState<Specialtie | null>(null);
    const [newInfo, setNewInfo] = useState<Specialtie>({
      name: "",
      description: ""
    });
    const [openAddModal, setOpenAddModal] = useState(false);
    const [newSpecialtie, setNewSpecialtie] = useState<Specialtie>({
      name: "",
      description: ""
    });
  const rowsPerPage = 25;

  const fetchData = async () => {
    const users = await getAllSpecialties();
    setAllSpecialtieData((users as Specialtie[]) || []);
    const specialties = await getAllSpecialties();
    setAllSpecialties(specialties);
  };

  const list = useAsyncList<Specialtie>({
    async load() {
      return { items: allSpecialtieData };
    },
  });

  useEffect(() => {
    list.reload();
  }, [allSpecialtieData]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return list.items;
    return list.items.filter(
      (item: Specialtie) =>
        item.name.toString().includes(searchQuery.toString()) ||
        item.name.toString().includes(searchQuery.toString())
    );
  }, [list.items, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page]);

  const handleDeleteSpecialtie = async (specialtieId: number) => {
    try {
      await deleteSpecialtie(specialtieId); // Call the API to delete the specialtie
      fetchData(); // Refresh the specialtie list after deletion
    } catch (error) {
      console.error("Failed to delete specialtie:", error);
    }
  };
  
    const handleUpdate = async (id: number) => {
      try {
        const filteredInfo = Object.fromEntries(
          Object.entries(newInfo).filter(
            ([_, value]) => value !== "" && value !== null && value !== undefined
          )
        );
        await updateSpecialtieInfo(id, filteredInfo); // Call the API to delete the user
        fetchData(); // Refresh the user list after deletion
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    };
  
    const handleAdd = async () => {
      try {
        await addSpecialtie(newSpecialtie); // Call the API to delete the user
        fetchData();
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, []);

  const renderSpecialtieCell = (
    data: Specialtie,
    columnKey: keyof Specialtie | "actions"
  ) => {
    const cellValue = columnKey !== "actions" ? data[columnKey] : undefined;
    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <div className="flex justify-center gap-4">
              <div className="relative group">
                <button aria-label="Chỉnh sửa"
                  onClick={() => {
                    setOpenUpdateModal(true);
                    setSelectedSpecialtie(data)
                  }}>
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
                    handleDeleteSpecialtie(data.id ? parseInt(data.id) : 0);
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
    { name: "Tên chuyên khoa", uid: "name" },
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
            <h1 className="text-3xl font-bold ">Quản lý chuyên khoa</h1>
            {/* Search Input */}
            <div className="mb-4 flex justify-between items-center">
              <Input
                placeholder="Tìm kiếm theo tên chuyên khoa..."
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
                onPress={()=>{setOpenAddModal(true)}}
              >
                Thêm mới
              </Button>
            </div>

            {allSpecialtieData.length > 0 && allSpecialties.length > 0 ? (
              <>
                <Table
                  isStriped
                  aria-label="Specialtie table with pagination and sorting"
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
                    {(item: Specialtie) => (
                      <TableRow key={item.id}>
                        {(columnKey: any) => (
                          <TableCell>
                            {renderSpecialtieCell(item, columnKey)}
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
      {/* Update */}
      <Drawer isOpen={openUpdateModal}>
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Cập nhật người dùng
              </DrawerHeader>
              <DrawerBody className="mt-4 flex-col gap-4">
                <Input
                  placeholder="Nhập tên chuyên khoa..."
                  label="Tên chuyên khoa"
                  value={
                    newInfo.name
                      ? newInfo.name
                      : selectedSpecialtie?.name
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewInfo({
                      ...newInfo,
                      name: e.target.value,
                    });
                  }}
                  className="w-full"
                />
                <Input
                  placeholder="Nhập mô tả..."
                  label="Mô tả"
                  value={
                    newInfo.description
                      ? newInfo.description
                      : selectedSpecialtie?.description
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewInfo({
                      ...newInfo,
                      description: e.target.value,
                    });
                  }}
                  className="w-full"
                />
              </DrawerBody>
              <DrawerFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setOpenUpdateModal(false);
                    setNewInfo({
                      name: "",
                      description: ""
                    });
                    setSelectedSpecialtie(null);
                  }}
                >
                  Close
                </Button>
                {selectedSpecialtie ? (
                  <Button
                    color="primary"
                    onPress={() => {
                      handleUpdate(
                        selectedSpecialtie.id ? parseInt(selectedSpecialtie.id) : 0
                      );
                    }}
                  >
                    Action
                  </Button>
                ) : (
                  <></>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
      {/* Add */}
      <Drawer isOpen={openAddModal}>
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Thêm người dùng
              </DrawerHeader>
              <DrawerBody className="mt-4 flex-col gap-4">
                <Input
                  placeholder="Nhập tên chuyên khoa..."
                  label="Tên chuyên khoa"
                  value={newSpecialtie.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewSpecialtie({
                      ...newSpecialtie,
                      name: e.target.value,
                    });
                  }}
                  className="w-full"
                />
                <Input
                  placeholder="Nhập mô tả..."
                  label="Mô tả"
                  value={newSpecialtie.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewSpecialtie({
                      ...newSpecialtie,
                      description: e.target.value,
                    });
                  }}
                  className="w-full"
                />
              </DrawerBody>
              <DrawerFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setOpenAddModal(false);
                    setNewSpecialtie({
                      name: "",
                      description: ""
                    });
                    setSelectedSpecialtie(null);
                  }}
                >
                  Close
                </Button>
                {newSpecialtie ? (
                  <Button
                    color="primary"
                    onPress={() => {
                      handleAdd();
                    }}
                  >
                    Action
                  </Button>
                ) : (
                  <></>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
      <Footer />
    </>
  );
}

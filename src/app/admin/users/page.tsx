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
  SortDescriptor,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  addUser,
  deleteUser,
  getAllUser,
  updateUserInfo,
} from "@/services/auth/functions";
import { useAsyncList } from "@react-stately/data";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { Select, SelectItem } from "@heroui/select";

interface User {
  id?: string;
  full_name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone_number: string;
  role: string;
  created_at: string;
}

interface Column {
  name: string;
  uid: keyof User | "actions";
  sortable?: boolean;
}

export default function AdminUsersPage() {
  const [allUserData, setAllUserData] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newInfo, setNewInfo] = useState<User>({
    full_name: "",
    email: "",
    phone_number: "",
    role: "",
    created_at: "",
  });
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    role: "",
    created_at: "",
  });
  const rowsPerPage = 25;

  const fetchData = async () => {
    const users = await getAllUser();
    setAllUserData((users as User[]) || []);
  };

  const list = useAsyncList<User>({
    async load() {
      return { items: allUserData };
    },
    async sort({
      items,
      sortDescriptor,
    }: {
      items: User[];
      sortDescriptor: SortDescriptor;
    }) {
      return {
        items: items.sort((a, b) => {
          if (sortDescriptor.column === "created_at") {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortDescriptor.direction === "ascending"
              ? dateA.getTime() - dateB.getTime()
              : dateB.getTime() - dateA.getTime();
          }
          return 0;
        }),
      };
    },
  });

  useEffect(() => {
    list.reload();
  }, [allUserData]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return list.items;
    return list.items.filter(
      (item: User) =>
        item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [list.items, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page]);

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId); // Call the API to delete the user
      fetchData(); // Refresh the user list after deletion
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleUpdate = async (userId: number) => {
    try {
      const filteredInfo = Object.fromEntries(
        Object.entries(newInfo).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      );
      await updateUserInfo(userId, filteredInfo); // Call the API to delete the user
      fetchData(); // Refresh the user list after deletion
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleAdd = async () => {
    try {
      if(newUser.confirmPassword !== newUser.password) {
        console.log("Mật khẩu không khớp")
      } else {
        await addUser(newUser); // Call the API to delete the user
        fetchData(); // Refresh the user list after deletion
      }
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

  const renderUserCell = (data: User, columnKey: keyof User | "actions") => {
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
                <button
                  aria-label="Chỉnh sửa"
                  onClick={() => {
                    if (!selectedUser || selectedUser.id != data.id) {
                      setSelectedUser(data);
                      setOpenUpdateModal(true);
                    } else {
                      setSelectedUser(null);
                      setNewInfo({
                        full_name: "",
                        email: "",
                        phone_number: "",
                        role: "",
                        created_at: "",
                      });
                      setOpenUpdateModal(false);
                    }
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
                  onClick={() => handleDelete(data.id ? parseInt(data.id) : 0)}
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
    { name: "Họ tên", uid: "full_name" },
    { name: "Email", uid: "email" },
    { name: "Số điện thoại", uid: "phone_number" },
    { name: "Role", uid: "role" },
    { name: "Ngày đăng ký", uid: "created_at", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  return (
    <>
      <Header />
      <div className="flex items-start w-screen mt-[90px]">
        <AdminSideBar />
        <div className="flex-1 min-h-screen p-8 bg-[#D5DBDB] box-border">
          <div className="w-full min-h-screen border rounded-lg bg-white p-6 box-border">
            <h1 className="text-3xl font-bold ">Quản lý người dùng</h1>
            {/* Search Input */}
            <div className="mb-4 flex justify-between items-center">
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
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
                onPress={() => {
                  setOpenAddModal(true);
                }}
              >
                Thêm mới
              </Button>
            </div>

            {allUserData.length > 0 ? (
              <>
                <Table
                  isStriped
                  aria-label="User table with pagination and sorting"
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
                    {(item: User) => (
                      <TableRow key={item.id}>
                        {(columnKey: any) => (
                          <TableCell>
                            {renderUserCell(item, columnKey)}
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
              <p>Loading....</p>
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
                  placeholder="Nhập họ tên..."
                  label="Họ tên"
                  value={
                    newInfo.full_name
                      ? newInfo.full_name
                      : selectedUser?.full_name
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewInfo({
                      ...newInfo,
                      full_name: e.target.value,
                    });
                  }}
                  className="w-full"
                />
                <Input
                  placeholder="Nhập số điện thoại..."
                  label="Số điện thoại"
                  value={
                    newInfo.phone_number
                      ? newInfo.phone_number
                      : selectedUser?.phone_number
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewInfo({
                      ...newInfo,
                      phone_number: e.target.value,
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
                      full_name: "",
                      email: "",
                      phone_number: "",
                      role: "",
                      created_at: "",
                    });
                    setSelectedUser(null);
                  }}
                >
                  Close
                </Button>
                {selectedUser ? (
                  <Button
                    color="primary"
                    onPress={() => {
                      handleUpdate(
                        selectedUser.id ? parseInt(selectedUser.id) : 0
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
                  placeholder="Nhập họ tên..."
                  label="Họ tên"
                  value={newUser.full_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewUser({
                      ...newUser,
                      full_name: e.target.value,
                    });
                  }}
                  className="w-full"
                />
                <Input
                  placeholder="Nhập email..."
                  label="Email"
                  value={newUser.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewUser({
                      ...newUser,
                      email: e.target.value,
                    });
                  }}
                  className="w-full"
                />
                <Input
                  placeholder="Nhập mật khẩu..."
                  label="Mật khẩu"
                  value={newUser.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewUser({
                      ...newUser,
                      password: e.target.value,
                    });
                  }}
                  className="w-full"
                />
                <Input
                  placeholder="Nhập lại mật khẩu..."
                  label="Xác nhận mật khẩu"
                  value={newUser.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewUser({
                      ...newUser,
                      confirmPassword: e.target.value,
                    });
                  }}
                  className="w-full"
                />
                <Input
                  placeholder="Nhập số điện thoại..."
                  label="Số điện thoại"
                  value={newUser.phone_number}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewUser({
                      ...newUser,
                      phone_number: e.target.value,
                    });
                  }}
                  className="w-full"
                />
                <Select
                  className="w-full"
                  label="Role"
                  placeholder="Chọn role"
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value,
                    })
                  }
                >
                  <SelectItem key="manage">Manager</SelectItem>
                  <SelectItem key="patient">Patient</SelectItem>
                  <SelectItem key="doctor">Doctor</SelectItem>
                </Select>
              </DrawerBody>
              <DrawerFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setOpenAddModal(false);
                    setNewUser({
                      full_name: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      phone_number: "",
                      role: "",
                      created_at: "",
                    });
                    setSelectedUser(null);
                  }}
                >
                  Close
                </Button>
                {newUser ? (
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

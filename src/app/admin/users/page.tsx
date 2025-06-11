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
import { PencilSquareIcon, TrashIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { Select, SelectItem } from "@heroui/select";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { Chip } from "@heroui/chip";
import { toggleUserStatus } from "@/services/auth/functions";
import LoadingSpinner from "@/components/LoadingSpinner";

interface User {
  id?: string;
  full_name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone_number: string;
  role: string;
  created_at: string;
  status: string;
}

interface ValidationErrors {
  full_name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone_number?: string;
  role?: string;
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
    status: "active",
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
    status: "active",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
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
      const result = await Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: "Hành động này không thể hoàn tác!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Có, xóa người dùng!',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        await deleteUser(userId);
        fetchData();
        toast.success('Xóa người dùng thành công!', {
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
      console.error("Failed to delete user:", error);
      toast.error('Xóa người dùng thất bại!', {
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

  const handleUpdate = async (userId: number) => {
    try {
      const filteredInfo = Object.fromEntries(
        Object.entries(newInfo).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
      );
      await updateUserInfo(userId, filteredInfo);
      fetchData();
      setOpenUpdateModal(false);
      setNewInfo({
        full_name: "",
        email: "",
        phone_number: "",
        role: "",
        created_at: "",
        status: "active",
      });
      setSelectedUser(null);
      toast.success('Cập nhật thông tin người dùng thành công!', {
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
      console.error("Failed to update user:", error);
      toast.error('Cập nhật thông tin người dùng thất bại!', {
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

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validate full name
    if (!newUser.full_name.trim()) {
      newErrors.full_name = "Họ tên không được để trống";
    } else if (newUser.full_name.trim().split(" ").length < 2) {
      newErrors.full_name = "Họ tên phải có ít nhất 2 từ";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newUser.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(newUser.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate password
    if (!newUser.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (newUser.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate confirm password
    if (!newUser.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống";
    } else if (newUser.password !== newUser.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    // Validate phone number
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!newUser.phone_number.trim()) {
      newErrors.phone_number = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(newUser.phone_number)) {
      newErrors.phone_number = "Số điện thoại không hợp lệ";
    }

    // Validate role
    if (!newUser.role) {
      newErrors.role = "Vui lòng chọn role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    try {
      if (validateForm()) {
        await addUser(newUser);
        fetchData();
        setOpenAddModal(false);
        setNewUser({
          full_name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone_number: "",
          role: "",
          created_at: "",
          status: "active",
        });
        setErrors({});
        toast.success('Thêm người dùng thành công!', {
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
      console.error("Failed to add user:", error);
      toast.error('Thêm người dùng thất bại!', {
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

  const handleToggleStatus = async (userId: number) => {
    try {
      await toggleUserStatus(userId);
      fetchData(); // Refresh the list after toggling status
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  const renderUserCell = (data: User, columnKey: keyof User | "actions") => {
    const cellValue = columnKey !== "actions" ? data[columnKey] : undefined;
    switch (columnKey) {
      case "status":
        if (data.status === "active") {
          return <Chip color="success">Đang hoạt động</Chip>;
        } else {
          return <Chip color="danger">Đã vô hiệu hóa</Chip>;
        }
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
                      setNewInfo({
                        full_name: data.full_name,
                        email: data.email,
                        phone_number: data.phone_number,
                        role: data.role,
                        created_at: data.created_at,
                        status: data.status,
                      });
                      setOpenUpdateModal(true);
                    } else {
                      setSelectedUser(null);
                      setNewInfo({
                        full_name: "",
                        email: "",
                        phone_number: "",
                        role: "",
                        created_at: "",
                        status: "active",
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
                  aria-label="Kích hoạt/Vô hiệu hóa"
                  onClick={() => handleToggleStatus(data.id ? parseInt(data.id) : 0)}
                >
                  <ShieldCheckIcon className={`h-5 w-5 ${data.status === 'active' ? 'text-green-500' : 'text-red-500'}`} />
                </button>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  {data.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
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
    { name: "Trạng thái", uid: "status" },
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
                  placeholder="Nhập họ tên..."
                  label="Họ tên"
                  value={newInfo.full_name}
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
                  value={newInfo.phone_number}
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
                      status: "active",
                    });
                    setSelectedUser(null);
                  }}
                >
                  Đóng
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
                    Cập nhật
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
                    if (errors.full_name) {
                      setErrors({ ...errors, full_name: undefined });
                    }
                  }}
                  className="w-full"
                  errorMessage={errors.full_name}
                  isInvalid={!!errors.full_name}
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
                    if (errors.email) {
                      setErrors({ ...errors, email: undefined });
                    }
                  }}
                  className="w-full"
                  errorMessage={errors.email}
                  isInvalid={!!errors.email}
                />
                <Input
                  placeholder="Nhập mật khẩu..."
                  label="Mật khẩu"
                  type="password"
                  value={newUser.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewUser({
                      ...newUser,
                      password: e.target.value,
                    });
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined });
                    }
                  }}
                  className="w-full"
                  errorMessage={errors.password}
                  isInvalid={!!errors.password}
                />
                <Input
                  placeholder="Nhập lại mật khẩu..."
                  label="Xác nhận mật khẩu"
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewUser({
                      ...newUser,
                      confirmPassword: e.target.value,
                    });
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: undefined });
                    }
                  }}
                  className="w-full"
                  errorMessage={errors.confirmPassword}
                  isInvalid={!!errors.confirmPassword}
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
                    if (errors.phone_number) {
                      setErrors({ ...errors, phone_number: undefined });
                    }
                  }}
                  className="w-full"
                  errorMessage={errors.phone_number}
                  isInvalid={!!errors.phone_number}
                />
                <Select
                  className="w-full"
                  label="Role"
                  placeholder="Chọn role"
                  onChange={(e) => {
                    setNewUser({
                      ...newUser,
                      role: e.target.value,
                    });
                    if (errors.role) {
                      setErrors({ ...errors, role: undefined });
                    }
                  }}
                  errorMessage={errors.role}
                  isInvalid={!!errors.role}
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
                      status: "active",
                    });
                    setSelectedUser(null);
                  }}
                >
                  Đóng
                </Button>
                {newUser ? (
                  <Button
                    color="primary"
                    onPress={() => {
                      handleAdd();
                    }}
                  >
                    Thêm
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

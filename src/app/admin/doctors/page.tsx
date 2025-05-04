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
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { getAllDoctors } from "@/services/doctors/functions";
import { useAsyncList } from "@react-stately/data";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { getAllSpecialties } from "@/services/specialties/functions";
import { Chip } from "@heroui/chip";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { updateDoctor } from "@/services/doctors/functions";
import { Select, SelectItem } from "@heroui/select";

interface Doctor {
  user_id?: number;
  license_number: string;
  gender: string;
  specialty_id: number;
  experience_years: number | string;
  education: string;
  workplace: string;
  bio: string;
  consultation_fee: number | "";
  is_verified: number;
}

interface Column {
  name: string;
  uid: keyof Doctor | "actions";
  sortable?: boolean;
}

export default function AdminDoctorsPage() {
  const [allDoctorData, setAllDoctorData] = useState<Doctor[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [newInfo, setNewInfo] = useState<Doctor>({
    license_number: "",
    gender: "",
    specialty_id: 0,
    experience_years: "",
    education: "",
    workplace: "",
    bio: "",
    consultation_fee: "",
    is_verified: 0,
  });
  const rowsPerPage = 25;

  const fetchData = async () => {
    const users = await getAllDoctors();
    setAllDoctorData((users as Doctor[]) || []);
    const specialties = await getAllSpecialties();
    setAllSpecialties(specialties);
  };

  const list = useAsyncList<Doctor>({
    async load() {
      return { items: allDoctorData };
    },
  });

  useEffect(() => {
    list.reload();
  }, [allDoctorData]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return list.items;
    return list.items.filter((item: Doctor) =>
      item.user_id
        ? item.user_id.toString().includes(searchQuery.toString())
        : false
    );
  }, [list.items, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page]);

  const handleUpdate = async (userId: number) => {
    try {
      const filteredInfo = Object.fromEntries(
        Object.entries(newInfo).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined && value !== 0
        )
      );

      await updateDoctor(userId, filteredInfo); // Call the API to delete the user
      fetchData(); // Refresh the user list after deletion
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

  const renderDoctorCell = (
    data: Doctor,
    columnKey: keyof Doctor | "actions"
  ) => {
    const cellValue = columnKey !== "actions" ? data[columnKey] : undefined;
    switch (columnKey) {
      case "gender":
        return cellValue == "male" ? "Nam" : "Nữ";
      case "consultation_fee":
        if (cellValue !== undefined && cellValue !== null) {
          const numericValue = parseInt(cellValue.toString());
          return numericValue.toLocaleString();
        }
        return "";
      case "is_verified":
        if (data.is_verified == 0) {
          return <Chip color="danger">Chưa xác thực</Chip>;
        } else if (data.is_verified == 1) {
          return <Chip color="success">Đã xác thực</Chip>;
        }
      case "specialty_id":
        console.log(
          allSpecialties.find(
            (specialties) => specialties.id == data[columnKey]
          )
        );
        const specialties = allSpecialties.find(
          (specialties) => specialties.id == data[columnKey]
        );
        return specialties ? specialties.name : "N/A";
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <div className="flex justify-center gap-4">
              <div className="relative group">
                <button
                  aria-label="Chỉnh sửa"
                  onClick={() => {
                    if (
                      !selectedDoctor ||
                      selectedDoctor.user_id != data.user_id
                    ) {
                      setSelectedDoctor(data);
                      setOpenUpdateModal(true);
                    } else {
                      setSelectedDoctor(null);
                      setNewInfo({
                        license_number: "",
                        gender: "",
                        specialty_id: 0,
                        experience_years: 0,
                        education: "",
                        workplace: "",
                        bio: "",
                        consultation_fee: "",
                        is_verified: 0,
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
              {/* <div className="relative group">
                <button aria-label="Xóa">
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </button>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Xóa
                </span>
              </div> */}
            </div>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const columns: Column[] = [
    { name: "ID người dùng", uid: "user_id" },
    { name: "Giấy phép hành nghề", uid: "license_number" },
    { name: "Giới tính", uid: "gender" },
    { name: "Chuyên khoa", uid: "specialty_id" },
    { name: "Số năm kinh nghiệm", uid: "experience_years" },
    { name: "Học vấn", uid: "education" },
    { name: "Nơi làm việc", uid: "workplace" },
    { name: "Mô tả bản thân", uid: "bio" },
    { name: "Phí tư vấn", uid: "consultation_fee" },
    { name: "Xác thực", uid: "is_verified" },
    { name: "ACTIONS", uid: "actions" },
  ];

  return (
    <>
      <Header />
      <div className="flex items-start w-screen mt-[90px]">
        <AdminSideBar />
        <div className="flex-1 min-h-screen p-8 bg-[#D5DBDB] box-border">
          <div className="w-full min-h-screen border rounded-lg bg-white p-6 box-border">
            <h1 className="text-3xl font-bold ">Quản lý bác sĩ</h1>
            {/* Search Input */}
            <div className="mb-4 flex justify-between items-center">
              <Input
                placeholder="Tìm kiếm theo ID người dùng..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="max-w-xs"
              />

              {/* <Button
                color="primary"
                className="w-fit text-lg bg-[#58D68D] text-[#34495E]"
                size="lg"
              >
                Thêm mới
              </Button> */}
            </div>

            {allDoctorData.length > 0 && allSpecialties.length > 0 ? (
              <>
                <Table
                  isStriped
                  aria-label="Doctor table with pagination and sorting"
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
                    {(item: Doctor) => (
                      <TableRow key={item.user_id}>
                        {(columnKey: any) => (
                          <TableCell>
                            {renderDoctorCell(item, columnKey)}
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

                {/* Update */}
                <Drawer isOpen={openUpdateModal}>
                  <DrawerContent>
                    {() => (
                      <>
                        <DrawerHeader className="flex flex-col gap-1">
                          Cập nhật thông tin bác sĩ
                        </DrawerHeader>
                        <DrawerBody className="mt-4 flex-col gap-4">
                          <Select
                            className="w-full"
                            label="Giới tính"
                            placeholder="Chọn giới tính"
                            defaultSelectedKeys={newInfo.gender
                              ? [newInfo.gender]
                              : selectedDoctor?.gender ? [selectedDoctor?.gender] : []}
                            onChange={(e) =>
                              setNewInfo({
                                ...newInfo,
                                gender: e.target.value,
                              })
                            }
                          >
                            <SelectItem key="male">Nam</SelectItem>
                            <SelectItem key="female">Nữ</SelectItem>
                          </Select>
                          <Input
                            placeholder="Nhập mã giấy phép..."
                            label="Giấy phép hành nghề"
                            value={
                              newInfo.license_number
                                ? newInfo.license_number
                                : selectedDoctor?.license_number ? selectedDoctor?.license_number : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewInfo({
                                ...newInfo,
                                license_number: e.target.value,
                              });
                            }}
                            className="w-full"
                          />
                          {allSpecialties ? (
                            <Select
                              className="w-full"
                              label="Chuyên khoa"
                              placeholder="Chọn chuyên khoa"
                              defaultSelectedKeys={
                                newInfo.specialty_id
                                  ? (() => {
                                      const found = allSpecialties.find(
                                        (specialty) => specialty.id === newInfo.specialty_id
                                      );
                                      return found ? [`${found.id}-${found.name}`] : [];
                                    })()
                                  : selectedDoctor?.specialty_id
                                  ? (() => {
                                      const found = allSpecialties.find(
                                        (specialty) => specialty.id === selectedDoctor.specialty_id
                                      );
                                      return found ? [`${found.id}-${found.name}`] : [];
                                    })()
                                  : []
                              }                              
                              onChange={(e) =>
                                setNewInfo({
                                  ...newInfo,
                                  specialty_id: parseInt(
                                    e.target.value.split("-")[0]
                                  ),
                                })
                              }
                            >
                              {allSpecialties.map((specialties) => (
                                <SelectItem key={specialties.id + "-" + specialties.name}>
                                  {specialties.id}-{specialties.name}
                                </SelectItem>
                              ))}
                            </Select>
                          ) : (
                            <></>
                          )}
                          <Input
                            placeholder="Nhập số năm kinh nghiệm..."
                            label="Kinh nghiệm"
                            value={
                              newInfo.experience_years
                                ? newInfo.experience_years.toString()
                                : selectedDoctor?.experience_years ? selectedDoctor?.experience_years.toString() : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewInfo({
                                ...newInfo,
                                experience_years: parseInt(e.target.value),
                              });
                            }}
                            className="w-full"
                          />
                          <Textarea
                            placeholder="Mô tả học vấn..."
                            label="Học vấn"
                            value={
                              newInfo.education
                                ? newInfo.education.toString()
                                : selectedDoctor?.education ? selectedDoctor?.education.toString() : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewInfo({
                                ...newInfo,
                                education: e.target.value,
                              });
                            }}
                            className="w-full"
                          />
                          <Textarea
                            placeholder="Nơi làm việc..."
                            label="Nơi làm việc"
                            value={
                              newInfo.workplace
                                ? newInfo.workplace.toString()
                                : selectedDoctor?.workplace ? selectedDoctor?.workplace.toString() : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewInfo({
                                ...newInfo,
                                workplace: e.target.value,
                              });
                            }}
                            className="w-full"
                          />
                          <Textarea
                            placeholder="Vài dòng mô tả bản thân..."
                            label="Mô tả bản thân"
                            value={
                              newInfo.bio
                                ? newInfo.bio.toString()
                                : selectedDoctor?.bio ? selectedDoctor?.bio.toString() : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewInfo({
                                ...newInfo,
                                bio: e.target.value,
                              });
                            }}
                            className="w-full"
                          />
                          <Input
                            placeholder="Nhập số năm kinh nghiệm..."
                            label="Kinh nghiệm"
                            value={
                              newInfo.consultation_fee
                                ? newInfo.consultation_fee.toString().split(".")[0]
                                : selectedDoctor?.consultation_fee ? selectedDoctor?.consultation_fee.toString().split(".")[0] : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewInfo({
                                ...newInfo,
                                consultation_fee: parseInt(e.target.value),
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
                                license_number: "",
                                gender: "",
                                specialty_id: 0,
                                experience_years: 0,
                                education: "",
                                workplace: "",
                                bio: "",
                                consultation_fee: "",
                                is_verified: 0,
                              });
                              setSelectedDoctor(null);
                            }}
                          >
                            Close
                          </Button>
                          {selectedDoctor ? (
                            <Button
                              color="primary"
                              onPress={() => {
                                handleUpdate(
                                  selectedDoctor.user_id
                                    ? selectedDoctor.user_id
                                    : 0
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
              </>
            ) : (
              <p>Loading....</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

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
import { getAllPatients } from "@/services/patients/functions";
import { useAsyncList } from "@react-stately/data";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { updatePatient } from "@/services/patients/functions";
import { Select, SelectItem } from "@heroui/select";

interface Patient {
  user_id?: number;
  date_of_birth: string;
  gender: string;
  medical_history: string;
  allergies: string;
  blood_type: string;
  height: string;
  weight: string;
  descriptions: string;
}

interface Column {
  name: string;
  uid: keyof Patient | "actions";
  sortable?: boolean;
}

export default function AdminPatientsPage() {
  const [allPatientData, setAllPatientData] = useState<Patient[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newInfo, setNewInfo] = useState<Patient>({
    date_of_birth: "",
    gender: "",
    medical_history: "",
    allergies: "",
    blood_type: "",
    height: "",
    weight: "",
    descriptions: "",
  });
  const rowsPerPage = 25;

  const fetchData = async () => {
    const patients = await getAllPatients();
    setAllPatientData((patients as Patient[]) || []);
  };

  const list = useAsyncList<Patient>({
    async load() {
      return { items: allPatientData };
    },
  });

  useEffect(() => {
    list.reload();
  }, [allPatientData]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return list.items;
    return list.items.filter((item: Patient) =>
      item.user_id
        ? item.user_id.toString().includes(searchQuery.toString())
        : 0
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
          ([_, value]) =>
            value !== "" && value !== null && value !== undefined && value !== 0
        )
      );

      await updatePatient(userId, filteredInfo); // Call the API to delete the user
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

  const renderPatientCell = (
    data: Patient,
    columnKey: keyof Patient | "actions"
  ) => {
    const cellValue = columnKey !== "actions" ? data[columnKey] : undefined;
    switch (columnKey) {
      case "gender":
        return cellValue == "male" ? "Nam" : "Nữ";
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <div className="flex justify-center gap-4">
              <div className="relative group">
                <button
                  aria-label="Chỉnh sửa"
                  onClick={() => {
                    if (
                      !selectedPatient ||
                      selectedPatient.user_id != data.user_id
                    ) {
                      setSelectedPatient(data);
                      setOpenUpdateModal(true);
                    } else {
                      setSelectedPatient(null);
                      setNewInfo({
                        date_of_birth: "",
                        gender: "",
                        medical_history: "",
                        allergies: "",
                        blood_type: "",
                        height: "",
                        weight: "",
                        descriptions: "",
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
    { name: "Giới tính", uid: "gender" },
    { name: "Ngày sinh", uid: "date_of_birth" },
    { name: "Tiền sử bệnh án", uid: "medical_history" },
    { name: "Dị ứng", uid: "allergies" },
    { name: "Nhóm máu", uid: "blood_type" },
    { name: "Chiều cao", uid: "height" },
    { name: "Cân nặng", uid: "weight" },
    { name: "Mô tả", uid: "descriptions" },
    { name: "ACTIONS", uid: "actions" },
  ];

  return (
    <>
      <Header />
      <div className="flex items-start w-screen mt-[90px]">
        <AdminSideBar />
        <div className="flex-1 min-h-screen p-8 bg-[#D5DBDB] box-border">
          <div className="w-full min-h-screen border rounded-lg bg-white p-6 box-border">
            <h1 className="text-3xl font-bold ">Quản lý bệnh nhân</h1>
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

            {allPatientData.length > 0 ? (
              <>
                <Table
                  isStriped
                  aria-label="Patient table with pagination and sorting"
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
                    {(item: Patient) => (
                      <TableRow key={item.user_id}>
                        {(columnKey: any) => (
                          <TableCell>
                            {renderPatientCell(item, columnKey)}
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
                            defaultSelectedKeys={
                              newInfo.gender
                                ? [newInfo.gender]
                                : selectedPatient?.gender
                                ? [selectedPatient?.gender]
                                : []
                            }
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
                            className="w-full"
                            label="Ngày sinh"
                            value={newInfo.date_of_birth
                              ? newInfo.date_of_birth.toString()
                              : selectedPatient?.date_of_birth
                              ? selectedPatient?.date_of_birth.toString()
                              : ""}
                            onChange={(value: any) => {
                              setNewInfo({
                                ...newInfo,
                                date_of_birth: value?.toString() || "", // hoặc xử lý khác tùy theo format bạn muốn
                              });
                            }}
                          />
                          <Input
                            placeholder="VD: A,AB..."
                            label="Nhóm máu"
                            value={
                              newInfo.blood_type
                                ? newInfo.blood_type.toString()
                                : selectedPatient?.blood_type
                                ? selectedPatient?.blood_type.toString()
                                : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewInfo({
                                ...newInfo,
                                blood_type: e.target.value,
                              });
                            }}
                            className="w-full"
                          />
                          <Input
                            placeholder="Chiều cao..."
                            label="Chiều cao"
                            value={
                              newInfo.height
                                ? newInfo.height.toString()
                                : selectedPatient?.height
                                ? selectedPatient?.height.toString()
                                : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewInfo({
                                ...newInfo,
                                height: e.target.value,
                              });
                            }}
                            className="w-full"
                          />
                          <Input
                            placeholder="Cân nặng..."
                            label="Cân nặng"
                            value={
                              newInfo.weight
                                ? newInfo.weight.toString()
                                : selectedPatient?.weight
                                ? selectedPatient?.weight.toString()
                                : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewInfo({
                                ...newInfo,
                                weight: e.target.value,
                              });
                            }}
                            className="w-full"
                          />
                          <Textarea
                            placeholder="Mô tả..."
                            label="Tiền sử bệnh án"
                            value={
                              newInfo.medical_history
                                ? newInfo.medical_history.toString()
                                : selectedPatient?.medical_history
                                ? selectedPatient?.medical_history.toString()
                                : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewInfo({
                                ...newInfo,
                                medical_history: e.target.value,
                              });
                            }}
                            className="w-full"
                          />
                          <Textarea
                            placeholder="Dị ứng với..."
                            label="Dị ứng"
                            value={
                              newInfo.allergies
                                ? newInfo.allergies.toString()
                                : selectedPatient?.allergies
                                ? selectedPatient?.allergies.toString()
                                : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewInfo({
                                ...newInfo,
                                allergies: e.target.value,
                              });
                            }}
                            className="w-full"
                          />
                          <Textarea
                            placeholder="Mô tả bệnh trạng..."
                            label="Mô tả"
                            value={
                              newInfo.descriptions
                                ? newInfo.descriptions.toString()
                                : selectedPatient?.descriptions
                                ? selectedPatient?.descriptions.toString()
                                : ""
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewInfo({
                                ...newInfo,
                                descriptions: e.target.value,
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
                                date_of_birth: "",
                                gender: "",
                                medical_history: "",
                                allergies: "",
                                blood_type: "",
                                height: "",
                                weight: "",
                                descriptions: "",
                              });
                              setSelectedPatient(null);
                            }}
                          >
                            Close
                          </Button>
                          {selectedPatient ? (
                            <Button
                              color="primary"
                              onPress={() => {
                                handleUpdate(
                                  selectedPatient.user_id
                                    ? selectedPatient.user_id
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

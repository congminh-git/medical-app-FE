"use client";

import { Avatar } from "@heroui/avatar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo, useRef, useState } from "react";
import { getUserInfo, putUserImage, updateUserInfo } from "@/services/auth/functions";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { getAllSpecialties } from "@/services/specialties/functions";
import {
  deleteAirticle,
  getAllDoctorArticles,
} from "@/services/articles/functions";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import {
  formatDateTime,
  generateSlug,
  getCurrentWeekDates,
  getDoctorDailyIncomeData,
  getDoctorMonthlyIncomeBarChartData,
  getDoctorPaymentMethodPieData,
  getDoctorTotalIncome,
} from "@/services/reUseFunctions";
import {
  getDoctorAppointmentByID,
  getPatientAppointmentByID,
  putAppointmentConfirmed,
} from "@/services/appointments/functions";
import { Chip } from "@heroui/chip";
import { CameraIcon } from "@heroicons/react/24/solid";

import { ChartData, ChartOptions } from "chart.js";
import ChartWrapper from "@/components/chartWrapper";
import { getAllUserPaymentTransactions } from "@/services/payment/functions";
import { Tooltip } from "@heroui/tooltip";

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/drawer";
import { getAllMedicineTypes } from "@/services/medicineTypes/functions";
import PrescriptionTable from "@/components/PrescriptionTable";
import { getPrescription } from "@/services/prescriptions/functions";
import TimeSlot from "@/components/doctors/timeSlot";

const ProfilePage = () => {
  const tokenDecode = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<number>(0);
  const [initialUserModel, setInitialUserModel] = useState<any>(null);
  const [userModel, setUserModel] = useState<any>(null);
  const [userImage, setUserImage] = useState<any>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [allSpecialties, setAllSpecialties] = useState<any[]>([]);
  const [doctorArticles, setDoctorArticles] = useState([]);
  const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const datesOfWeek = useMemo(() => getCurrentWeekDates().weekDates, []);
  const [userAppointment, setUserAppointment] = useState<any>([]);
  const [allPaymentTransaction, setAllPaymentTransaction] = useState([]);
  const [medicineTypes, setMedicineTypes] = useState<any>([]);
  const [prescriptions, setPrescriptions] = useState<any>([]);
  const [openConsultationModal, setOpenConsultationModal] =
    useState<boolean>(false);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null)

  const [dailyIncomeData, setDailyIncomeData] =
    useState<ChartData<"line"> | null>(null);
  const [dailyIncomeOptions, setDailyIncomeOptions] =
    useState<ChartOptions<"line"> | null>(null);

  const [monthlyIncomeData, setMonthlyIncomeData] =
    useState<ChartData<"bar"> | null>(null);
  const [monthlyIncomeOptions, setMonthlyIncomeOptions] =
    useState<ChartOptions<"bar"> | null>(null);

  const [monthlyPaymentMethodData, setMonthlyPaymentMethodData] =
    useState<ChartData<"pie"> | null>(null);
  const [monthlyPaymentMethodOptions, setMonthlyPaymentMethodOptions] =
    useState<ChartOptions<"pie"> | null>(null);

  const doctorArticlesColumns = [
    { name: "SPECIALTIES", uid: "specialties" },
    { name: "TITLE", uid: "title" },
    { name: "VIEWS", uid: "views" },
    { name: "LIKES", uid: "likes" },
    { name: "CREATED_AT", uid: "created_at" },
    { name: "UPDATED_AT", uid: "updated_at" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const userDoctorAppointmentColumn = [
    { name: "PATIENT", uid: "patient" },
    { name: "TIME", uid: "appointment_time" },
    { name: "STATUS", uid: "status" },
    { name: "CREATED_AT", uid: "created_at" },
    { name: "CONSULTATION", uid: "consultation" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const userPatientAppointmentColumn = [
    { name: "DOCTOR", uid: "doctor" },
    { name: "TIME", uid: "appointment_time" },
    { name: "STATUS", uid: "status" },
    { name: "CREATED_AT", uid: "created_at" },
    { name: "CONSULTATION", uid: "consultation" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const patientPaymentTransactions = [
    { name: "Transactions ID", uid: "trans_id" },
    { name: "Order ID", uid: "order_id" },
    { name: "Doctor", uid: "doctor_id" },
    { name: "Amount", uid: "amount" },
    { name: "Status", uid: "status" },
    { name: "Time", uid: "created_at" },
  ];

  const getSpecialties = async () => {
    const specialties = await getAllSpecialties();
    setAllSpecialties(specialties);
  };

  const getArticles = async () => {
    const articles = await getAllDoctorArticles(tokenDecode.id);
    setDoctorArticles(articles);
  };

  const getUserAppointment = async (id: number) => {
    if (tokenDecode.role == "doctor") {
      const appointments = await getDoctorAppointmentByID(id);
      setUserAppointment(appointments);
    } else {
      const appointments = await getPatientAppointmentByID(id);
      setUserAppointment(appointments);
    }
  };

  const getMedicineData = async () => {
    const medicineTypesData = await getAllMedicineTypes();
    setMedicineTypes(medicineTypesData);
  };

  const getPrescriptionData = async (id: number) => {
    const data = await getPrescription(id);
    setPrescriptions(data);
  };

  const getUser = async (id: number) => {
    const userInfo: any = await getUserInfo(id);
    if (userInfo) {
      const formattedUser = {
        id: userInfo?.id,
        full_name: userInfo?.full_name,
        email: userInfo?.email,
        phone_number: userInfo?.phone_number,
        role: userInfo?.role,
        details: { ...userInfo?.details },
        image: userInfo?.image,
      };

      setUser(formattedUser);
      setUserModel(formattedUser);
      setInitialUserModel(formattedUser);
      getUserAppointment(tokenDecode.id);
      getMedicineData();
    }
  };

  const handleImageToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage((prev: any) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    const result = await updateUserInfo(tokenDecode.id, userModel);
    if (result.status == "200") {
      await getUser(tokenDecode.id);
      setIsChanged(false);
    }
  };

  const handleGetAllPaymentTransactions = async (id: number) => {
    const result = await getAllUserPaymentTransactions(id);
    setAllPaymentTransaction(result);
  };

  const handlePutUserImage = async () => {
    const result = await putUserImage(tokenDecode.id, userImage);
    if (result.id) {
      const formattedUser = {
        ...user,
        image: result.image,
      };

      setUser(formattedUser);
      setUserModel(formattedUser);
      setInitialUserModel(formattedUser);
    }
  } 

  useEffect(() => {
    if (tokenDecode) {
      setIsLogin(true);
      getUser(tokenDecode.id);
      getSpecialties();
    }
  }, [tokenDecode]);

  useEffect(() => {
    if (userModel) {
      console.log(userModel);
    }
  }, [userModel]);

  useEffect(() => {
    if (!initialUserModel || !userModel) return;
    setIsChanged(
      JSON.stringify(initialUserModel) !== JSON.stringify(userModel)
    );
  }, [userModel, initialUserModel]);

  useEffect(() => {
    const dailyIncome = getDoctorDailyIncomeData(allPaymentTransaction);
    setDailyIncomeData(dailyIncome.data);
    setDailyIncomeOptions(dailyIncome.options);

    const monthlyIncome = getDoctorMonthlyIncomeBarChartData(
      allPaymentTransaction
    );
    setMonthlyIncomeData(monthlyIncome.data);
    setMonthlyIncomeOptions(monthlyIncome.options);

    const monthlyPaymentMethod = getDoctorPaymentMethodPieData(
      allPaymentTransaction
    );
    setMonthlyPaymentMethodData(monthlyPaymentMethod.data);
    setMonthlyPaymentMethodOptions(monthlyPaymentMethod.options);
  }, [allPaymentTransaction]);

  useEffect(() => {
    if (tab === 3) {
      if (tokenDecode.role === "doctor") {
        getArticles();
      } else if (tokenDecode.role === "patient") {
        handleGetAllPaymentTransactions(tokenDecode.id);
      }
    } else if (tab == 5) {
      handleGetAllPaymentTransactions(tokenDecode.id);
    }
  }, [tab]);

  useEffect(() => {
    console.log(selectedConsultation);
    if (selectedConsultation && selectedConsultation.prescription_id) {
      getPrescriptionData(selectedConsultation.prescription_id);
    }
  }, [selectedConsultation]);

  useEffect(() => {
    if (userImage) {
      handlePutUserImage()
    }
  }, [userImage]);

  const renderDoctorArticlesCell = (data: any, columnKey: any) => {
    const cellValue = data[columnKey];
    switch (columnKey) {
      case "created_at":
        const createDate = new Date(cellValue);
        return createDate.toLocaleString();
      case "updated_at":
        const updateDate = new Date(cellValue);
        return updateDate.toLocaleString();
      case "likes":
        return data.likes ? data.likes.split(", ").length : 0;
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <button content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <a
                  href={`/articles` + generateSlug(data.title, data.id)}
                  className=""
                >
                  <EyeIcon className="w-4 h-4" />
                </a>
              </span>
            </button>
            <button content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <a
                  href={
                    `/profile/articles/update` +
                    generateSlug(data.title, data.id)
                  }
                  className=""
                >
                  <PencilIcon className="w-4 h-4" />
                </a>
              </span>
            </button>
            <button
              color="danger"
              content="Delete user"
              onClick={async () => {
                const result = await deleteAirticle(data.id, tokenDecode.id);
                if (!result) {
                  getArticles();
                }
              }}
            >
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <TrashIcon className="w-4 h-4" />
              </span>
            </button>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const renderUserPaymentTransactionsCell = (data: any, columnKey: any) => {
    const cellValue = data[columnKey];
    switch (columnKey) {
      case "created_at":
        const createDate = new Date(cellValue);
        return createDate.toLocaleString();
      case "doctor_id":
        return data.doctor.full_name;
      case "amount":
        return parseInt(data.amount).toLocaleString() + " VNĐ";
      case "status":
        if (data.status == "failed") {
          return <Chip color="danger">{data.status}</Chip>;
        } else if (data.status == "success") {
          return <Chip color="success">{data.status}</Chip>;
        }
        return (
          <div className="relative flex items-center justify-center gap-2">
            <button content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                {data.url &&
                (data.status == "pending" || data.status == "confirmed") ? (
                  <Button
                    color="primary"
                    onPress={() => {
                      putAppointmentConfirmed(data.id);
                      router.replace(data.url);
                    }}
                    className=""
                  >
                    Tham gia
                  </Button>
                ) : (
                  <></>
                )}
              </span>
            </button>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const renderPatientAppointmentCell = (data: any, columnKey: any) => {
    const cellValue = data[columnKey];
    switch (columnKey) {
      case "created_at":
        const createDate = new Date(cellValue);
        return createDate.toLocaleString();
      case "patient":
        return data.patient.full_name;
      case "doctor":
        return data.doctor.full_name;
      case "consultation":
        return (
          <div className="w-full flex justify-center">
            {data.consultations[0] && (
              <Tooltip content="Xem chẩn đoán, đơn thuốc">
                <button
                  onClick={() => {
                    setOpenConsultationModal(true);
                    setSelectedConsultation(data.consultations[0]);
                  }}
                  className="bg-yellow-400 p-2 rounded-lg hover:bg-yellow-500"
                >
                  <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
                </button>
              </Tooltip>
            )}
          </div>
        );
      case "appointment_time":
        const appointmentTime = new Date(data.appointment_time * 1000); // Nếu timestamp là giây
        const hours = appointmentTime.getHours().toString().padStart(2, "0"); // Giờ (2 chữ số)
        const minutes = appointmentTime
          .getMinutes()
          .toString()
          .padStart(2, "0"); // Phút (2 chữ số)
        const day = appointmentTime.getDate().toString().padStart(2, "0"); // Ngày (2 chữ số)
        const month = (appointmentTime.getMonth() + 1)
          .toString()
          .padStart(2, "0"); // Tháng (2 chữ số)
        const year = appointmentTime.getFullYear(); // Năm (4 chữ số)

        // Trả về chuỗi theo định dạng "HH:mm dd/MM/yyyy"
        return `${hours}:${minutes} ${day}/${month}/${year}`;
      case "status":
        if (data.status == "pending") {
          return <Chip color="secondary">{data.status}</Chip>;
        } else if (data.status == "canceled") {
          return <Chip color="danger">{data.status}</Chip>;
        } else if (data.status == "confirmed") {
          return <Chip color="warning">{data.status}</Chip>;
        } else if (data.status == "completed") {
          return <Chip color="success">{data.status}</Chip>;
        }
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <button content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                {data.url &&
                (data.status == "pending" || data.status == "confirmed") ? (
                  <Button
                    color="primary"
                    onPress={() => {
                      putAppointmentConfirmed(data.id);
                      router.replace(`/meeting/${data.id}`);
                    }}
                    className=""
                  >
                    Tham gia
                  </Button>
                ) : (
                  <></>
                )}
              </span>
            </button>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <>
      {isLogin ? (
        <>
          <Header />

          <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">
            <div className="bg-white mm flex justify-center flex-wrap w-full">
              <section className="w-full max-w-screen-xl pt-20  bg-white flex justify-center items-center flex-wrap">
                <div className="w-full flex justify-start items-center">
                  <div className="w-full border-b-2">
                    <div className="flex w-full items-start gap-4 mb-4">
                      <div className="relative">
                        <Avatar
                          className="h-[300px] w-[300px]"
                          src={user?.image}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageToBase64}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gray-400 h-12 w-12 border-white border-2 text-white flex justify-center items-center rounded-full absolute bottom-6 right-6 shadow hover:bg-gray-500"
                        >
                          <CameraIcon className="w-5 h-5" />
                        </button>
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-[#2C3E50]">
                          {tokenDecode?.fullName}
                        </h1>
                        <p className="text-sm text-[#777777]">
                          {tokenDecode?.role === "patient"
                            ? "Người dùng"
                            : tokenDecode?.role === "doctor"
                            ? "Bác sĩ"
                            : "Chưa xác định"}
                        </p>
                        <p className="text-sm text-[#777777]">
                          Email: {tokenDecode?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-end gap-[1px]">
                      {[
                        "Thông tin cá nhân",
                        "Cập nhật thông tin",
                        "Lịch tư vấn",
                      ].map((label, index) => (
                        <button
                          key={index}
                          onClick={() => setTab(index)}
                          className={`border-t-2 border-l-2 border-r-2 p-4 rounded-t border-gray-300 ${
                            tab === index ? "bg-white shadow" : "bg-gray-200"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                      {tokenDecode.role == "doctor" ? (
                        ["Bài viết", "Lịch sử tư vấn", "Doanh thu"].map(
                          (label, index) => (
                            <button
                              key={index}
                              onClick={() => setTab(index + 3)}
                              className={`border-t-2 border-l-2 border-r-2 p-4 rounded-t border-gray-300 ${
                                tab === index + 3
                                  ? "bg-white shadow"
                                  : "bg-gray-200"
                              }`}
                            >
                              {label}
                            </button>
                          )
                        )
                      ) : (
                        <></>
                      )}
                      {tokenDecode.role == "patient" ? (
                        ["Lịch sử giao dịch"].map((label, index) => (
                          <button
                            key={index}
                            onClick={() => setTab(index + 3)}
                            className={`border-t-2 border-l-2 border-r-2 p-4 rounded-t border-gray-300 ${
                              tab === index + 3
                                ? "bg-white shadow"
                                : "bg-gray-200"
                            }`}
                          >
                            {label}
                          </button>
                        ))
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="w-full max-w-screen-xl  py-8 bg-white flex justify-center items-start flex-wrap">
                {tab === 0 && user ? (
                  tokenDecode?.role == "patient" ? (
                    <div className="w-full grid grid-cols-2 gap-8">
                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Họ tên
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.full_name}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Email
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.email}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Số điện thoại
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.phone_number}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Ngày sinh
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.details?.date_of_birth
                            ? new Date(user?.details?.date_of_birth)
                                .toISOString()
                                .split("T")[0]
                            : ""}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Giới tính
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.details?.gender === "male" ? "Nam" : "Nữ"}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Chiều cao
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.details?.height
                            ? `${user?.details?.height}cm`
                            : ""}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Cân nặng
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.details?.weight
                            ? `${user?.details?.weight}kg`
                            : ""}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Nhóm máu
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.details?.blood_type}
                        </p>
                      </div>

                      <div className="w-full col-span-2">
                        <p className="text-base font-semibold text-gray-600">
                          Dị ứng
                        </p>
                        <p className="text-lg text-gray-900 mt-1 whitespace-pre-line">
                          {user?.details?.allergies}
                        </p>
                      </div>

                      <div className="w-full col-span-2">
                        <p className="text-base font-semibold text-gray-600">
                          Lịch sử bệnh án
                        </p>
                        <p className="text-lg text-gray-900 mt-1 whitespace-pre-line">
                          {user?.details?.medical_history}
                        </p>
                      </div>

                      <div className="w-full col-span-2">
                        <p className="text-base font-semibold text-gray-600">
                          Mô tả tình trạng
                        </p>
                        <p className="text-lg text-gray-900 mt-1 whitespace-pre-line">
                          {user?.details?.descriptions}
                        </p>
                      </div>
                    </div>
                  ) : tokenDecode?.role == "doctor" ? (
                    <div className="w-full grid grid-cols-2 gap-8">
                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Họ tên
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.full_name}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Email
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.email}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Số điện thoại
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.phone_number}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Số giấy phép hành nghề
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.details?.license_number}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Giới tính
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.details?.gender === "male" ? "Nam" : "Nữ"}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Chuyên khoa
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {
                            allSpecialties?.find(
                              (s: any) => s.id === user?.details?.specialty_id
                            )?.name
                          }
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Số năm kinh nghiệm
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.details?.experience_years}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Nơi làm việc
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1">
                          {user?.details?.workplace}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Phí tư vấn
                        </p>
                        <p className="text-lg text-orange-500 font-medium mt-1">
                          {parseInt(
                            user?.details?.consultation_fee
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Xác nhận danh tính
                        </p>
                        <p
                          className={`text-lg mt-1 font-medium ${
                            user?.details?.is_verified
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {user?.details?.is_verified
                            ? "Đã xác nhận"
                            : "Chưa xác nhận"}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Học vấn
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1 whitespace-pre-line">
                          {user?.details?.education}
                        </p>
                      </div>

                      <div className="w-full">
                        <p className="text-base font-semibold text-gray-600">
                          Mô tả bản thân
                        </p>
                        <p className="text-lg text-gray-900 font-medium mt-1 whitespace-pre-line">
                          {user?.details?.bio}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )
                ) : tab === 1 && userModel ? (
                  tokenDecode?.role == "patient" ? (
                    <div className="w-full">
                      <div className="w-full grid grid-cols-2 gap-8">
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Họ tên:
                          </label>
                          <input
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            type="text"
                            value={userModel?.full_name}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                full_name: event.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Email:
                          </label>
                          <input
                            className="border rounded-md bg-gray-400 py-2 px-4 mt-1 w-full"
                            disabled
                            type="text"
                            value={userModel?.email}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                email: event.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Số điện thoại:
                          </label>
                          <input
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            type="text"
                            value={userModel?.phone_number}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                phone_number: event.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Ngày sinh:
                          </label>
                          <input
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            type="date"
                            value={
                              userModel?.details?.date_of_birth
                                ? new Date(userModel?.details?.date_of_birth)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  date_of_birth: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Giới tính:
                          </label>
                          <select
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            value={userModel?.details?.gender}
                            onChange={(event) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  gender: event.target.value,
                                },
                              })
                            }
                          >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                          </select>
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Chiều cao:
                          </label>
                          <input
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            type="text"
                            value={userModel?.details?.height}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  height: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Cân nặng:
                          </label>
                          <input
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            type="text"
                            value={userModel?.details?.weight}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  weight: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Nhóm máu:
                          </label>
                          <input
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            type="text"
                            value={userModel?.details?.blood_type}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  blood_type: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Dị ứng:
                          </label>
                          <textarea
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            value={userModel?.details?.allergies}
                            rows={5}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  allergies: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Lịch sử bệnh án:
                          </label>
                          <textarea
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            value={userModel?.details?.medical_history}
                            rows={5}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  medical_history: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Mô tả tình trạng:
                          </label>
                          <textarea
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            value={userModel?.details?.descriptions}
                            rows={5}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  descriptions: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-8">
                        <Button
                          color="primary"
                          className={`px-6 py-2 rounded-md ${
                            isChanged
                              ? "bg-[#F39C12] text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          size="lg"
                          disabled={!isChanged}
                          onPress={() => handleSaveChanges()}
                        >
                          Lưu thay đổi
                        </Button>
                      </div>
                    </div>
                  ) : tokenDecode?.role == "doctor" ? (
                    <div className="w-full">
                      <div className="w-full grid grid-cols-2 gap-8">
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Họ tên:
                          </label>
                          <input
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            type="text"
                            value={userModel?.full_name}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                full_name: event.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Email:
                          </label>
                          <input
                            className="border rounded-md bg-gray-400 py-2 px-4 mt-1 w-full"
                            disabled
                            type="text"
                            value={userModel?.email}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                email: event.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Số điện thoại:
                          </label>
                          <input
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            type="text"
                            value={userModel?.phone_number}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                phone_number: event.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Số giấy phép hành nghề:
                          </label>
                          <input
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            type="text"
                            value={user?.details?.license_number}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  license_number: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Giới tính:
                          </label>
                          <select
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            value={userModel?.details?.gender}
                            onChange={(event) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  gender: event.target.value,
                                },
                              })
                            }
                          >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                          </select>
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Chuyên khoa:
                          </label>
                          <select
                            className="border rounded-md-2 px-4 mt-1 w-full"
                            disabled
                            value={user?.details?.specialty_id}
                          >
                            {allSpecialties?.map((specialty: any) => {
                              return (
                                <option key={specialty.id} value={specialty.id}>
                                  {specialty.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Số năm kinh nghiệm:
                          </label>
                          <input
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            type="text"
                            value={user?.details?.experience_years}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  experience_years: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Nơi làm việc
                          </label>
                          <input
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            type="text"
                            value={user?.details?.workplace}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  workplace: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Phí tư vấn:
                          </label>
                          <input
                            className="border rounded-md bg-gray-400 py-2 px-4 mt-1 w-full"
                            value={user?.details?.consultation_fee}
                            disabled
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  consultation_fee: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Xác nhận danh tính
                          </label>
                          <input
                            className={`border rounded-md bg-gray-400 py-2 px-4 mt-1 w-full ${
                              user?.details?.is_verified
                                ? "bg-green-400"
                                : "bg-red-400"
                            }`}
                            value={
                              user?.details?.is_verified
                                ? "Đã xác nhận"
                                : "Chưa xác nhận"
                            }
                            disabled
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Học vấn:
                          </label>
                          <textarea
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            value={user?.details?.education}
                            rows={5}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  education: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label className="block" htmlFor="">
                            Mô tả bản thân:
                          </label>
                          <textarea
                            className="border rounded-md bg-gray-200 py-2 px-4 mt-1 w-full"
                            value={user?.details?.bio}
                            rows={5}
                            onChange={(event: any) =>
                              setUserModel({
                                ...userModel,
                                details: {
                                  ...userModel.details,
                                  bio: event.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-8">
                        <Button
                          color="primary"
                          className={`px-6 py-2 rounded-md ${
                            isChanged
                              ? "bg-[#F39C12] text-white"
                              : "bg-gray-300 text-gray-500"
                          }`}
                          size="lg"
                          disabled={!isChanged}
                          onPress={() => handleSaveChanges()}
                        >
                          Lưu thay đổi
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )
                ) : tab === 2 && userModel ? (
                  tokenDecode.role == "doctor" ? (
                    <div className="w-full">
                    <h2 className="mb-4 text-2xl font-semibold">
                      Lịch tư vấn tuần, ngày {datesOfWeek?.[0]} đến{" "}
                      {datesOfWeek?.[5]}{" "}
                    </h2>
                    <div className={`w-full grid grid-cols-6`}>
                      {daysOfWeek?.map((item: any, index: number) => {
                        return (
                          <div className="col-span-1 py-6 flex justify-center flex-wrap items-center border border-gray-300 font-bold text-white bg-slate-600 ">
                            <div className="w-full flex justify-center">
                              {item}
                            </div>
                            <div className="w-full flex justify-center">
                              {datesOfWeek?.[index]}
                            </div>
                          </div>
                        );
                      })}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`07:00-${index}`}
                          time="07:00 - 07:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`07:30-${index}`}
                          time="07:30 - 08:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`08:00-${index}`}
                          time="08:00 - 08:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`08:30-${index}`}
                          time="08:30 - 09:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`09:30-${index}`}
                          time="09:30 - 10:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`10:00-${index}`}
                          time="10:00 - 13:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`10:30-${index}`}
                          time="10:30 - 11:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`11:00-${index}`}
                          time="11:00 - 11:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => {
                        return (
                          <div key={index} className="col-span-1 py-4 flex justify-center flex-wrap items-center border border-gray-300 font-bold bg-gray-300 text-gray-500"></div>
                        );
                      })}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`13:30-${index}`}
                          time="13:30 - 14:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`14:00-${index}`}
                          time="14:00 - 14:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}
                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`14:30-${index}`}
                          time="14:30 - 15:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`15:00-${index}`}
                          time="15:00 - 15:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`16:00-${index}`}
                          time="16:00 - 16:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`16:30-${index}`}
                          time="16:30 - 17:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}
                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`17:00-${index}`}
                          time="17:00 - 17:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}
                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`17:30-${index}`}
                          time="17:30 - 18:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={userAppointment}
                        />
                      ))}
                    </div>
                  </div>
                  ) : (
                    <div className="w-full">
                      <h2 className="mb-4 text-2xl font-semibold">
                        Lịch tư vấn đã đăng ký
                      </h2>
                      <Table
                        isStriped
                        aria-label="Example table with custom cells"
                      >
                        <TableHeader columns={userPatientAppointmentColumn}>
                          {(column) => (
                            <TableColumn
                              key={column.uid}
                              align={
                                column.uid === "actions" ||
                                column.uid === "consultation"
                                  ? "center"
                                  : "start"
                              }
                            >
                              {column.name}
                            </TableColumn>
                          )}
                        </TableHeader>
                        <TableBody items={userAppointment}>
                          {(item: any) => (
                            <TableRow key={item.id}>
                              {(columnKey) => (
                                <TableCell>
                                  {renderPatientAppointmentCell(
                                    item,
                                    columnKey
                                  )}
                                </TableCell>
                              )}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )
                ) : tab === 3 && userModel ? (
                  tokenDecode?.role == "patient" ? (
                    <div className="w-full">
                      <h2 className="mb-4 text-2xl font-semibold">
                        Lịch sử giao dịch
                      </h2>
                      <Table
                        isStriped
                        aria-label="Example table with custom cells"
                      >
                        <TableHeader columns={patientPaymentTransactions}>
                          {(column) => (
                            <TableColumn
                              key={column.uid}
                              align={
                                column.uid === "actions" ? "center" : "start"
                              }
                            >
                              {column.name}
                            </TableColumn>
                          )}
                        </TableHeader>
                        <TableBody items={allPaymentTransaction}>
                          {(item: any) => (
                            <TableRow key={item.order_id}>
                              {(columnKey) => (
                                <TableCell>
                                  {renderUserPaymentTransactionsCell(
                                    item,
                                    columnKey
                                  )}
                                </TableCell>
                              )}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  ) : tokenDecode?.role == "doctor" ? (
                    <div className="w-full">
                      <div className="w-full flex justify-end">
                        <Button
                          color="primary"
                          className={`px-6 py-2 rounded-md bg-[#F39C12] text-white`}
                          size="lg"
                        >
                          <a
                            href="/profile/articles/add"
                            className="w-full h-full flex items-center justify-center"
                          >
                            Thêm bài viết
                          </a>
                        </Button>
                      </div>
                      <div className="w-full mt-4">
                        <Table
                          isStriped
                          aria-label="Example table with custom cells"
                        >
                          <TableHeader columns={doctorArticlesColumns}>
                            {(column) => (
                              <TableColumn
                                key={column.uid}
                                align={
                                  column.uid === "actions" ? "center" : "start"
                                }
                              >
                                {column.name}
                              </TableColumn>
                            )}
                          </TableHeader>
                          <TableBody items={doctorArticles}>
                            {(item: any) => (
                              <TableRow key={item.id}>
                                {(columnKey) => (
                                  <TableCell>
                                    {renderDoctorArticlesCell(item, columnKey)}
                                  </TableCell>
                                )}
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )
                ) : tab === 4 && userModel ? (
                  tokenDecode.role == "doctor" ? (
                    <div className="w-full">
                      <h2 className="mb-4 text-2xl font-semibold">
                        Lịch tư vấn đã đăng ký
                      </h2>
                      <Table
                        isStriped
                        aria-label="Example table with custom cells"
                      >
                        <TableHeader columns={userDoctorAppointmentColumn}>
                          {(column) => (
                            <TableColumn
                              key={column.uid}
                              align={
                                column.uid === "actions" ||
                                column.uid === "consultation"
                                  ? "center"
                                  : "start"
                              }
                            >
                              {column.name}
                            </TableColumn>
                          )}
                        </TableHeader>
                        <TableBody items={userAppointment}>
                          {(item: any) => (
                            <TableRow key={item.id}>
                              {(columnKey) => (
                                <TableCell>
                                  {renderPatientAppointmentCell(
                                    item,
                                    columnKey
                                  )}
                                </TableCell>
                              )}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <></>
                  )
                ) : tab === 5 && userModel ? (
                  tokenDecode.role == "doctor" ? (
                    <div className="w-full">
                      {allPaymentTransaction ? (
                        <div className="mb-10 pb-4 border-b">
                          <h3 className="text-4xl font-semibold">
                            Số dư hiện tại:{" "}
                            <span className="text-orange-500 font-bold">
                              {getDoctorTotalIncome(
                                allPaymentTransaction
                              ).toLocaleString()}{" "}
                              VNĐ
                            </span>
                          </h3>
                          <p className="italic">
                            Thu nhập của bác sĩ gồm là 90% giá tư trị vấn, 10%
                            là phí sử dụng nền tảng theo hợp đồng đã ký
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}
                      {dailyIncomeData && dailyIncomeOptions ? (
                        <div className="mb-10 pb-4 border-b">
                          <h3 className="text-4xl font-semibold mb-4">
                            Doanh thu hàng ngày
                          </h3>
                          <ChartWrapper
                            type="line"
                            data={dailyIncomeData}
                            options={dailyIncomeOptions}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      {monthlyIncomeData && monthlyIncomeOptions ? (
                        <div className="mb-10 pb-4 border-b">
                          <h3 className="text-4xl font-semibold mb-4">
                            Doanh thu hàng tháng trong năm
                          </h3>
                          <ChartWrapper
                            type="bar"
                            data={monthlyIncomeData}
                            options={monthlyIncomeOptions}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      ,
                      {monthlyPaymentMethodData &&
                      monthlyPaymentMethodOptions ? (
                        <div className="mb-10 pb-4 border-b">
                          <h3 className="text-4xl font-semibold mb-4">
                            Tỉ lệ phương thức thanh toán
                          </h3>
                          <ChartWrapper
                            type="pie"
                            data={monthlyPaymentMethodData}
                            options={monthlyPaymentMethodOptions}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
              </section>
            </div>
          </div>

          <Drawer isOpen={openConsultationModal} size="2xl">
            <DrawerContent>
              {() => (
                <>
                  <DrawerHeader className="flex flex-col gap-1 text-2xl font-bold">
                    Chuẩn đoán
                  </DrawerHeader>
                  <DrawerBody className="mt-4 flex-col gap-8">
                    <div className="w-full flex justify-between items-center mb-4 text-sm italic">
                      <span>
                        Ngày tạo:{" "}
                        {formatDateTime(selectedConsultation?.created_at)}
                      </span>
                      <span>
                        Cập nhật:{" "}
                        {formatDateTime(selectedConsultation?.updated_at)}{" "}
                      </span>
                    </div>
                    <div className="w-full">
                      <h4 className="w-full font-bold text-gray-800">
                        Lý Do Tư Vấn / Khám
                      </h4>
                      <p className="w-full text-gray-700">
                        {selectedConsultation?.chief_complaint}
                      </p>
                    </div>
                    <div className="w-full">
                      <h4 className="w-full font-bold text-gray-800">
                        Tiền Sử Bệnh Lý
                      </h4>
                      <p className="w-full text-gray-700">
                        {selectedConsultation?.medical_history}
                      </p>
                    </div>
                    <div className="w-full">
                      <h4 className="w-full font-bold text-gray-800">
                        Triệu chứng
                      </h4>
                      <p className="w-full text-gray-700">
                        {selectedConsultation?.symptoms}
                      </p>
                    </div>
                    <div className="w-full">
                      <h4 className="w-full font-bold text-gray-800">
                        Chẩn Đoán
                      </h4>
                      <p className="w-full text-gray-700">
                        {selectedConsultation?.diagnosis}
                      </p>
                    </div>
                    <div className="w-full">
                      <h4 className="w-full font-bold text-gray-800">
                        Chẩn Đoán Khác
                      </h4>
                      <p className="w-full text-gray-700">
                        {selectedConsultation?.differential_diagnosis}
                      </p>
                    </div>
                    <div className="w-full">
                      <h4 className="w-full font-bold text-gray-800">
                        Chuẩn đoán loại bệnh
                      </h4>
                      <p className="w-full text-gray-700">
                        {selectedConsultation?.disease_types}
                      </p>
                    </div>
                    <div className="w-full">
                      <h4 className="w-full font-bold text-gray-800">
                        Kế Hoạch Điều Trị
                      </h4>
                      <p className="w-full text-gray-700">
                        {selectedConsultation?.treatment_plan}
                      </p>
                    </div>
                    <div className="w-full">
                      <h4 className="w-full font-bold text-gray-800">
                        Hướng Dẫn Tái Khám
                      </h4>
                      <p className="w-full text-gray-700">
                        {selectedConsultation?.follow_up_instructions}
                      </p>
                    </div>
                    <div className="w-full">
                      <h4 className="w-full font-bold text-gray-800">
                        Khuyến Nghị
                      </h4>
                      <p className="w-full text-gray-700">
                        {selectedConsultation?.recommendations}
                      </p>
                    </div>
                    <div className="w-full">
                      <h4 className="w-full font-bold text-gray-800">
                        Ghi Chú
                      </h4>
                      <p className="w-full text-gray-700">
                        {selectedConsultation?.notes}
                      </p>
                    </div>
                    {medicineTypes &&
                    prescriptions &&
                    prescriptions.prescription_info ? (
                      <PrescriptionTable
                        prescriptions={JSON.parse(
                          prescriptions.prescription_info
                        )}
                        medicineTypes={medicineTypes}
                      />
                    ) : (
                      <></>
                    )}
                  </DrawerBody>
                  <DrawerFooter>
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() => {
                        setOpenConsultationModal(false);
                      }}
                    >
                      Close
                    </Button>
                  </DrawerFooter>
                </>
              )}
            </DrawerContent>
          </Drawer>

          <Footer />
        </>
      ) : null}
    </>
  );
};

export default ProfilePage;

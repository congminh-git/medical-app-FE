"use client";

import { Avatar } from "@heroui/avatar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { getAllSpecialties } from "@/services/specialties/functions";
import {
  getCurrentWeekDates,
} from "@/services/reUseFunctions";
import { useParams } from "next/navigation";
import { getDoctorById } from "@/services/doctors/functions";
import {
  getAppointmentsThisWeek,
  postAppointmentsThisWeek,
} from "@/services/appointments/functions";
import ChatBox from "@/components/chatBox";
import { Button } from "@heroui/button";
import PaymentModal from "@/components/paymentModal";
import TimeSlot from "@/components/doctors/timeSlot";

const DoctorProfilePage = () => {
  const tokenDecode = useAuth();
  const params = useParams();
  const id = useMemo(() => (params?.id as string) || "", [params?.id]);

  const [isLogin, setIsLogin] = useState(false);
  const [tab, setTab] = useState<number>(0);
  const [allSpecialties, setAllSpecialties] = useState<any[]>([]);
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any>([]);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<boolean | "null">("null");
  const [timestamp, setTimestamp] = useState<number>(0);

  const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const datesOfWeek = useMemo(() => getCurrentWeekDates().weekDates, []);
  const todayIndex = useMemo(() => getCurrentWeekDates().todayIndex, []);

  const [showChat, setShowChat] = useState(false);
  const [senderID, setSenderID] = useState(0);
  const [recieveID, setRecieveID] = useState(0);

  const handleCloseChat = () => {
    setSenderID(tokenDecode.id);
    setRecieveID(doctor.user_id);
    setShowChat(!showChat); // Đóng chat box
  };

  const handleShowPaymentModal = () => {
    setShowPaymentModal(!showPaymentModal);
  };

  useEffect(() => {
    if (tokenDecode) {
      setIsLogin(true);
      setSenderID(tokenDecode.id);
      if (allSpecialties.length === 0) {
        getAllSpecialties().then(setAllSpecialties);
      }

      if (id) {
        getDoctorById(parseInt(id)).then(async (doctorData) => {
          setDoctor(doctorData);
          setRecieveID(doctorData.user_id);
          const appointments = await getAppointmentsThisWeek(
            doctorData.user_id
          );
          setAppointments(appointments);
        });
      }
    }
  }, [tokenDecode, id]);

  const createAppointment = async (
    patientID: number,
    doctorID: number,
    timestamp: number
  ) => {
    setPaymentStatus("null");
    const result = await postAppointmentsThisWeek(
      patientID,
      doctorID,
      timestamp
    );
    if (result.id) {
      const appointments = await getAppointmentsThisWeek(doctor.user_id);
      setAppointments(appointments);
      console.log("Đăng ký thành công");
    } else {
      console.log("Đăng ký thất bại");
    }
  };

  useEffect(() => {
    if (paymentStatus != "null") {
      if (paymentStatus) {
        createAppointment(tokenDecode.id, doctor.user_id, timestamp);
      }
    }
  }, [paymentStatus]);

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
                    <div className="flex justify-between items-start">
                      <div className="flex w-full items-start gap-4 mb-4">
                        <Avatar
                          className="h-[300px] w-[300px]"
                          src={doctor?.user?.image}
                        />
                        <div>
                          <h1 className="text-2xl font-bold text-[#2C3E50]">
                            Bác sĩ: {doctor?.user?.full_name}
                          </h1>
                          <p className="text-sm text-[#777777]">
                            Email: {doctor?.user?.email}
                          </p>
                          <p className="text-sm text-[#777777]">
                            Phone: {doctor?.user?.phone_number}
                          </p>

                          <Button
                            onPress={() => handleCloseChat()}
                            className="mt-2 text-white bg-[#F39C12]"
                          >
                            Chat với bác sĩ
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-end gap-[1px]">
                      {["Thông tin cá nhân", "Lịch tư vấn"].map(
                        (label, index) => (
                          <button
                            key={index}
                            onClick={() => setTab(index)}
                            className={`border-t-2 border-l-2 border-r-2 p-4 rounded-t border-gray-300 ${
                              tab === index ? "bg-white shadow" : "bg-gray-200"
                            }`}
                          >
                            {label}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="w-full max-w-screen-xl  py-8 bg-white flex justify-center items-center flex-wrap">
                {tab === 0 && doctor ? (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                    <div>
                      <p className="text-base font-semibold text-gray-600">
                        Họ tên
                      </p>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        {doctor?.user?.full_name}
                      </p>
                    </div>

                    <div>
                      <p className="text-base font-semibold text-gray-600">
                        Email
                      </p>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        {doctor?.user?.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-base font-semibold text-gray-600">
                        Số điện thoại
                      </p>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        {doctor?.user?.phone_number}
                      </p>
                    </div>

                    <div>
                      <p className="text-base font-semibold text-gray-600">
                        Số giấy phép hành nghề
                      </p>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        {doctor?.license_number}
                      </p>
                    </div>

                    <div>
                      <p className="text-base font-semibold text-gray-600">
                        Giới tính
                      </p>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        {doctor?.gender === "male" ? "Nam" : "Nữ"}
                      </p>
                    </div>

                    <div>
                      <p className="text-base font-semibold text-gray-600">
                        Chuyên khoa
                      </p>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        {allSpecialties?.find(
                          (sp: any) => sp.id === doctor?.specialty_id
                        )?.name || "Không rõ"}
                      </p>
                    </div>

                    <div>
                      <p className="text-base font-semibold text-gray-600">
                        Số năm kinh nghiệm
                      </p>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        {doctor?.experience_years || "Chưa cập nhật"}
                      </p>
                    </div>

                    <div>
                      <p className="text-base font-semibold text-gray-600">
                        Nơi làm việc
                      </p>
                      <p className="text-lg font-medium text-gray-900 mt-1">
                        {doctor?.workplace || "Chưa cập nhật"}
                      </p>
                    </div>

                    <div>
                      <p className="text-base font-semibold text-gray-600">
                        Phí tư vấn
                      </p>
                      <p className="text-lg font-medium text-orange-500 mt-1">
                        {doctor?.consultation_fee
                          ? `${parseInt(doctor.consultation_fee).toLocaleString()} VND`
                          : "Miễn phí"}
                      </p>
                    </div>

                    <div>
                      <p className="text-base font-semibold text-gray-600">
                        Xác minh
                      </p>
                      <p
                        className={`text-lg font-bold mt-1 ${
                          doctor?.is_verified
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {doctor?.is_verified ? "Đã xác minh" : "Chưa xác minh"}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-base font-semibold text-gray-600">
                        Học vấn
                      </p>
                      <p className="text-lg text-gray-900 mt-1 whitespace-pre-line">
                        {doctor?.education || "Chưa cập nhật"}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-base font-semibold text-gray-600">
                        Mô tả bản thân
                      </p>
                      <p className="text-lg text-gray-900 mt-1 whitespace-pre-line">
                        {doctor?.bio || "Chưa có mô tả"}
                      </p>
                    </div>
                  </div>
                ) : tab === 1 && doctor ? (
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
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`07:30-${index}`}
                          time="07:30 - 08:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`08:00-${index}`}
                          time="08:00 - 08:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`08:30-${index}`}
                          time="08:30 - 09:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`09:30-${index}`}
                          time="09:30 - 10:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`10:00-${index}`}
                          time="10:00 - 13:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`10:30-${index}`}
                          time="10:30 - 11:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`11:00-${index}`}
                          time="11:00 - 11:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
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
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`14:00-${index}`}
                          time="14:00 - 14:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}
                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`14:30-${index}`}
                          time="14:30 - 15:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`15:00-${index}`}
                          time="15:00 - 15:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`16:00-${index}`}
                          time="16:00 - 16:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}

                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`16:30-${index}`}
                          time="16:30 - 17:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}
                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`17:00-${index}`}
                          time="17:00 - 17:30"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}
                      {daysOfWeek?.map((item: any, index: number) => (
                        <TimeSlot
                          key={`17:30-${index}`}
                          time="17:30 - 18:00"
                          index={index}
                          datesOfWeek={datesOfWeek}
                          appointments={appointments}
                          setTimestamp={setTimestamp}
                          setShowPaymentModal={setShowPaymentModal}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </section>
            </div>
          </div>

          {doctor ? (
            showChat && (
              <div className="fixed bottom-8 right-8">
                <ChatBox
                  userId={senderID}
                  receiverId={recieveID}
                  onClose={handleCloseChat}
                  handleFetchUnread={() => {
                    // Hàm xử lý khi cần fetch lại tin nhắn chưa đọc
                    console.log("Refetch unread messages");
                  }}
                />
              </div>
            )
          ) : (
            <></>
          )}

          {tab === 1 && doctor ? (
            showPaymentModal && (
              <PaymentModal
                totalCost={parseInt(doctor.consultation_fee)}
                userID={tokenDecode.id}
                doctorID={doctor.user_id}
                onClose={handleShowPaymentModal}
                setPaymentStatus={setPaymentStatus}
              ></PaymentModal>
            )
          ) : (
            <></>
          )}

          <Footer />
        </>
      ) : null}
    </>
  );
};

export default DoctorProfilePage;

"use client";

import { Avatar } from "@heroui/avatar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import PageFallback from "@/components/fallback";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo, useState, useCallback } from "react";
import { getAllSpecialties } from "@/services/specialties/functions";
import { getCurrentWeekDates } from "@/services/reUseFunctions";
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
import { useChatContext } from "@/context/chatContext";
import type { Comment, User } from "@/interfaces/comment";
import { CommentFlow } from "@/components/commentFlow/commentFlow";
import { adddReview, getAllDoctorReviews } from "@/services/reviews/functions";

const DoctorProfilePage = () => {
  const tokenDecode = useAuth();
  const { openChat } = useChatContext();
  const params = useParams();
  const id = useMemo(() => (params?.id as string) || "", [params?.id]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  
  // Data states
  const [tab, setTab] = useState<number>(0);
  const [allSpecialties, setAllSpecialties] = useState<any[]>([]);
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<boolean | "null">("null");
  const [timestamp, setTimestamp] = useState<number>(0);

  // Memoized values
  const daysOfWeek = useMemo(() => ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"], []);
  const datesOfWeek = useMemo(() => getCurrentWeekDates().weekDates, []);
  const isLogin = useMemo(() => !!tokenDecode, [tokenDecode]);

  // Memoized specialty name
  const specialtyName = useMemo(() => {
    return allSpecialties?.find((sp: any) => sp.id === doctor?.specialty_id)?.name || "Không rõ";
  }, [allSpecialties, doctor?.specialty_id]);

  // Fetch doctor reviews
  const handleGetDoctorReview = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsCommentsLoading(true);
      const data = await getAllDoctorReviews(parseInt(id));
      setComments(data);
    } catch (error) {
      console.error("Error fetching doctor reviews:", error);
    } finally {
      setIsCommentsLoading(false);
    }
  }, [id]);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    if (!tokenDecode || !id) return;

    try {
      setIsLoading(true);
      
      // Fetch all data in parallel
      const [specialtiesData, doctorData] = await Promise.all([
        getAllSpecialties(),
        getDoctorById(parseInt(id))
      ]);

      setAllSpecialties(specialtiesData);
      setDoctor(doctorData);

      // Fetch appointments and reviews in parallel
      const [appointmentsData, reviewsData] = await Promise.all([
        getAppointmentsThisWeek(doctorData.user_id),
        getAllDoctorReviews(parseInt(id))
      ]);

      setAppointments(appointmentsData);
      setComments(reviewsData);
      
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [tokenDecode, id]);

  // Handle chat open
  const handleCloseChat = useCallback(() => {
    if (tokenDecode && doctor) {
      openChat(tokenDecode.id, doctor.user_id);
    }
  }, [tokenDecode, doctor, openChat]);

  // Handle payment modal
  const handleShowPaymentModal = useCallback(() => {
    setShowPaymentModal(prev => !prev);
  }, []);

  // Handle new comment submission
  const handleNewComment = useCallback(async (commentData: {
    userId: string;
    content: string;
  }) => {
    if (!tokenDecode || !doctor) return;

    try {
      console.log("Submitting comment:", commentData);
      
      const newCommentEntry: Comment = {
        patient_id: tokenDecode.id,
        doctor_id: doctor.user_id,
        feedback: commentData.content
      };
      
      const response = await adddReview(newCommentEntry);
      
      if (response.id) {
        await handleGetDoctorReview();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  }, [tokenDecode, doctor, handleGetDoctorReview]);

  // Create appointment
  const createAppointment = useCallback(async (
    patientID: number,
    doctorID: number,
    timestamp: number
  ) => {
    try {
      setPaymentStatus("null");
      const result = await postAppointmentsThisWeek(patientID, doctorID, timestamp);
      
      if (result.id) {
        const updatedAppointments = await getAppointmentsThisWeek(doctor.user_id);
        setAppointments(updatedAppointments);
        console.log("Đăng ký thành công");
      } else {
        console.log("Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  }, [doctor?.user_id]);

  // Effect for initial data loading
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Effect for payment status
  useEffect(() => {
    if (paymentStatus !== "null" && tokenDecode && doctor) {
      if (paymentStatus) {
        createAppointment(tokenDecode.id, doctor.user_id, timestamp);
      }
    }
  }, [paymentStatus, tokenDecode, doctor, timestamp, createAppointment]);

  // Show loading fallback
  if (isLoading) {
    console.log("📱 Rendering Doctor Profile PageFallback...");
    return <PageFallback />;
  }

  // Show nothing if not logged in
  if (!isLogin) {
    return null;
  }

  return (
    <>
      <Header />

      <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">
        <div className="bg-white mm flex justify-center flex-wrap w-full">
          <section className="w-full max-w-screen-xl pt-20 bg-white flex justify-center items-center flex-wrap">
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
                        onPress={handleCloseChat}
                        className="mt-2 text-white bg-[#F39C12]"
                      >
                        Chat với bác sĩ
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex w-full items-center justify-end gap-[1px]">
                  {["Thông tin cá nhân", "Lịch tư vấn"].map((label, index) => (
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
                </div>
              </div>
            </div>
          </section>

          <section className="w-full max-w-screen-xl py-8 bg-white flex justify-center items-center flex-wrap">
            {tab === 0 && doctor ? (
              <>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                  <div>
                    <p className="text-base font-semibold text-gray-600">Họ tên</p>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {doctor?.user?.full_name}
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-semibold text-gray-600">Email</p>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {doctor?.user?.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-semibold text-gray-600">Số điện thoại</p>
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
                    <p className="text-base font-semibold text-gray-600">Giới tính</p>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {doctor?.gender === "male" ? "Nam" : "Nữ"}
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-semibold text-gray-600">Chuyên khoa</p>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {specialtyName}
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
                    <p className="text-base font-semibold text-gray-600">Nơi làm việc</p>
                    <p className="text-lg font-medium text-gray-900 mt-1">
                      {doctor?.workplace || "Chưa cập nhật"}
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-semibold text-gray-600">Phí tư vấn</p>
                    <p className="text-lg font-medium text-orange-500 mt-1">
                      {doctor?.consultation_fee
                        ? `${parseInt(doctor.consultation_fee).toLocaleString()} VND`
                        : "Miễn phí"}
                    </p>
                  </div>

                  <div>
                    <p className="text-base font-semibold text-gray-600">Xác minh</p>
                    <p
                      className={`text-lg font-bold mt-1 ${
                        doctor?.is_verified ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {doctor?.is_verified ? "Đã xác minh" : "Chưa xác minh"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-base font-semibold text-gray-600">Học vấn</p>
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
                
                <div className="mt-20 w-full">
                  {isCommentsLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  ) : (
                    <CommentFlow
                      comments={comments}
                      currentUser={{
                        id: tokenDecode.id,
                        image: tokenDecode.image,
                        full_name: tokenDecode.fullName,
                      }}
                      onCommentSubmit={handleNewComment}
                    />
                  )}
                </div>
              </>
            ) : tab === 1 && doctor ? (
              <div className="w-full">
                <h2 className="mb-4 text-2xl font-semibold">
                  Lịch tư vấn tuần, ngày {datesOfWeek?.[0]} đến {datesOfWeek?.[5]}
                </h2>
                <div className={`w-full grid grid-cols-6`}>
                  {daysOfWeek?.map((item: any, index: number) => (
                    <div
                      key={`day-${index}`}
                      className="col-span-1 py-6 flex justify-center flex-wrap items-center border border-gray-300 font-bold text-white bg-slate-600"
                    >
                      <div className="w-full flex justify-center">{item}</div>
                      <div className="w-full flex justify-center">
                        {datesOfWeek?.[index]}
                      </div>
                    </div>
                  ))}

                  {/* Time slots */}
                  {[
                    "07:00 - 07:30",
                    "07:30 - 08:00",
                    "08:00 - 08:30",
                    "08:30 - 09:00",
                    "09:30 - 10:00",
                    "10:00 - 13:00",
                    "10:30 - 11:00",
                    "11:00 - 11:30",
                  ].map((timeSlot) =>
                    daysOfWeek?.map((_, index: number) => (
                      <TimeSlot
                        key={`${timeSlot}-${index}`}
                        time={timeSlot}
                        index={index}
                        datesOfWeek={datesOfWeek}
                        appointments={appointments}
                        setTimestamp={setTimestamp}
                        setShowPaymentModal={setShowPaymentModal}
                      />
                    ))
                  )}

                  {/* Break time */}
                  {daysOfWeek?.map((_, index: number) => (
                    <div
                      key={`break-${index}`}
                      className="col-span-1 py-4 flex justify-center flex-wrap items-center border border-gray-300 font-bold bg-gray-300 text-gray-500"
                    />
                  ))}

                  {/* Afternoon slots */}
                  {[
                    "13:30 - 14:00",
                    "14:00 - 14:30",
                    "14:30 - 15:00",
                    "15:00 - 15:30",
                    "16:00 - 16:30",
                    "16:30 - 17:00",
                    "17:00 - 17:30",
                    "17:30 - 18:00",
                  ].map((timeSlot) =>
                    daysOfWeek?.map((_, index: number) => (
                      <TimeSlot
                        key={`${timeSlot}-${index}`}
                        time={timeSlot}
                        index={index}
                        datesOfWeek={datesOfWeek}
                        appointments={appointments}
                        setTimestamp={setTimestamp}
                        setShowPaymentModal={setShowPaymentModal}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      {/* Payment Modal */}
      {tab === 1 && doctor && showPaymentModal && (
        <PaymentModal
          totalCost={parseInt(doctor.consultation_fee)}
          userID={tokenDecode.id}
          doctorID={doctor.user_id}
          onClose={handleShowPaymentModal}
          setPaymentStatus={setPaymentStatus}
        />
      )}

      <Footer />
    </>
  );
};

export default DoctorProfilePage;
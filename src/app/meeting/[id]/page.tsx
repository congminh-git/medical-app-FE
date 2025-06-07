"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getAppointmentByID,
  putAppointmentStatus,
} from "@/services/appointments/functions";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PageFallback from "@/components/fallback";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { getAllSymptoms } from "@/services/symptoms/functions";
import { Button } from "@heroui/button";
import { getAllDiseaseTypes } from "@/services/diseaseTypes/functions";
import { getAllDiagnosis } from "@/services/diagnosis/functions";
import { Checkbox } from "@heroui/checkbox";
import { getAllMedicineTypes } from "@/services/medicineTypes/functions";
import MedicineTable from "@/components/medicineTable";
import { createConsultation } from "@/services/consultations/functions";
import { useAuth } from "@/hooks/useAuth";

export interface Consultation {
  appointment_id?: number | null;
  prescription_id?: number | null;
  doctor_id?: string;
  patient_id?: string;
  chief_complaint: string;
  medical_history?: string | null;
  symptoms: string;
  disease_types: string;
  diagnosis: string;
  differential_diagnosis?: string | null;
  treatment_plan: string;
  follow_up_instructions?: string | null;
  recommendations?: string | null;
  notes?: string | null;
}

export default function MeetingPage() {
  const tokenDecode = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = useMemo(() => (params?.id as string) || "", [params?.id]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Data states
  const [appointment, setAppointment] = useState<any>(null);
  const [symptoms, setSymptoms] = useState<any>([]);
  const [diseaseTypes, setDiseaseTypes] = useState<any>([]);
  const [diagnosis, setDiagnosis] = useState<any>([]);
  const [medicineTypes, setMedicineTypes] = useState<any>([]);
  const [prescriptions, setPrescriptions] = useState<any>([]);
  const [selectedMedicineIDs, setSelectedMedicineIDs] = useState<string[]>([]);

  // UI states
  const [saved, setSave] = useState(false);
  const [havePrescriptions, setHavePrescriptions] = useState(false);

  // Memoized initial consultation state
  const initialConsultation = useMemo(() => ({
    appointment_id: parseInt(id) || null,
    doctor_id: appointment?.doctor_id || "",
    patient_id: appointment?.patient_id || "",
    chief_complaint: "",
    medical_history: "",
    symptoms: "",
    disease_types: "",
    diagnosis: "",
    differential_diagnosis: "",
    treatment_plan: "",
    follow_up_instructions: "",
    recommendations: "",
    notes: "",
  }), [id, appointment?.doctor_id, appointment?.patient_id]);

  const [consultation, setConsultation] = useState<Consultation>(initialConsultation);

  // Memoized computed values
  const isDoctor = useMemo(() => tokenDecode?.role === "doctor", [tokenDecode?.role]);
  const hasValidAppointment = useMemo(() => appointment && appointment.url, [appointment]);

  // Fetch all required data in parallel
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [
        appointmentData,
        symptomsData,
        diseaseTypesData,
        diagnosisData,
        medicineTypesData,
      ] = await Promise.all([
        id ? getAppointmentByID(parseInt(id)) : Promise.resolve(null),
        getAllSymptoms(),
        getAllDiseaseTypes(),
        getAllDiagnosis(),
        getAllMedicineTypes(),
      ]);

      setAppointment(appointmentData);
      setSymptoms(symptomsData);
      setDiseaseTypes(diseaseTypesData);
      setDiagnosis(diagnosisData);
      setMedicineTypes(medicineTypesData);

      // Update consultation with appointment data
      if (appointmentData) {
        setConsultation(prev => ({
          ...prev,
          doctor_id: appointmentData.doctor_id,
          patient_id: appointmentData.patient_id,
        }));

        // Update appointment status if it has URL
        if (appointmentData.url) {
          await putAppointmentStatus(appointmentData.id, "completed");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Handle form field changes
  const handleInputChange = useCallback((
    field: keyof Consultation,
    value: string
  ) => {
    setConsultation(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle multi-selection changes
  const handleMultiSelectionChange = useCallback((
    e: any,
    key: "symptoms" | "disease_types" | "diagnosis" | "differential_diagnosis"
  ) => {
    handleInputChange(key, e.target.value);
  }, [handleInputChange]);

  // Handle medicine selection
  const handleSetSelectedMedicineIDs = useCallback((e: any) => {
    const ids = e.target.value.split(",").filter(Boolean);
    setSelectedMedicineIDs(ids);
  }, []);

  // Handle back navigation
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // Handle consultation creation
  const handleCreateConsultation = useCallback(async () => {
    try {
      setIsSaving(true);
      const data = await createConsultation({
        consultations: consultation,
        prescriptions: prescriptions,
      });

      if (data.id) {
        setSave(true);
      }
    } catch (error) {
      console.error("Error creating consultation:", error);
    } finally {
      setIsSaving(false);
    }
  }, [consultation, prescriptions]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Show loading fallback
  if (isLoading) {
    console.log("📱 Rendering Meeting PageFallback...");
    return <PageFallback />;
  }

  // Show error states
  if (!appointment) {
    return (
      <>
        <Header />
        <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">
          <div className="w-full max-w-screen-xl py-10 text-center">
            <p className="text-lg text-gray-600">Đang tải thông tin cuộc hẹn...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!appointment.url) {
    return (
      <>
        <Header />
        <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">
          <div className="w-full max-w-screen-xl py-10 text-center">
            <p className="text-lg text-red-600">Không tìm thấy URL meeting</p>
            <Button
              onClick={handleGoBack}
              className="mt-4 bg-[#58D68D] text-gray-800"
            >
              Quay lại
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">
        {/* Meeting Section */}
        <section className="w-full min-h-screen max-w-screen-xl py-10 bg-white">
          <button
            onClick={handleGoBack}
            className="mb-4 px-4 py-2 flex items-center gap-2 bg-[#58D68D] text-gray-800 rounded hover:bg-gray-300 transition"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Quay lại
          </button>
          <div className="h-full">
            <iframe
              src={appointment.url}
              width="100%"
              height="100%"
              allow="camera; microphone; fullscreen; display-capture"
              style={{ border: "none" }}
              className="block"
            />
          </div>
        </section>

        {/* Diagnosis Section - Only for doctors */}
        {isDoctor && (
          <section className="w-full max-w-screen-xl py-10 bg-white">
            <div className="my-4">
              <h2 className="text-2xl font-bold">
                Chẩn đoán{" "}
                <span
                  className={`py-1 px-2 rounded-lg text-white italic font-normal text-sm ${
                    saved ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {saved ? "Đã lưu" : "Chưa lưu"}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Chief Complaint */}
              <Textarea
                placeholder="Mô tả ngắn gọn lý do bệnh nhân đến khám (triệu chứng chính)"
                label="Lý Do Tư Vấn / Khám"
                value={consultation.chief_complaint}
                onChange={(e) => handleInputChange("chief_complaint", e.target.value)}
                className="w-full overflow-auto col-span-2"
              />

              {/* Medical History */}
              <Textarea
                placeholder="Tiền sử bệnh lý của bệnh nhân (bệnh mãn tính, dị ứng, phẫu thuật)"
                label="Tiền Sử Bệnh Lý"
                value={consultation.medical_history || ""}
                onChange={(e) => handleInputChange("medical_history", e.target.value)}
                className="w-full overflow-auto col-span-2"
              />

              {/* Symptoms */}
              <Select
                placeholder="Chọn các triệu chứng"
                label="Triệu chứng"
                selectionMode="multiple"
                onChange={(e) => handleMultiSelectionChange(e, "symptoms")}
                className="w-full overflow-auto col-span-2"
              >
                {symptoms.map((symptom: any) => (
                  <SelectItem key={symptom.name}>{symptom.name}</SelectItem>
                ))}
              </Select>

              {/* Diagnosis */}
              <Select
                placeholder="Chẩn đoán chính của bác sĩ (Tên các triệu chứng cụ thể)"
                label="Chẩn Đoán"
                selectionMode="multiple"
                onChange={(e) => handleMultiSelectionChange(e, "diagnosis")}
                className="w-full overflow-auto col-span-2"
              >
                {diagnosis.map((disease: any) => (
                  <SelectItem key={disease.name}>{disease.name}</SelectItem>
                ))}
              </Select>

              {/* Differential Diagnosis */}
              <Select
                placeholder="Các chẩn đoán khác có thể xem xét (nếu có)"
                label="Chẩn Đoán Khác"
                selectionMode="multiple"
                onChange={(e) => handleMultiSelectionChange(e, "differential_diagnosis")}
                className="w-full overflow-auto col-span-2"
              >
                {diagnosis.map((disease: any) => (
                  <SelectItem key={disease.name}>{disease.name}</SelectItem>
                ))}
              </Select>

              {/* Disease Types */}
              <Select
                placeholder="Bác sĩ đưa ra bệnh lý chuẩn đoán"
                label="Chuẩn đoán loại bệnh"
                selectionMode="multiple"
                onChange={(e) => handleMultiSelectionChange(e, "disease_types")}
                className="w-full overflow-auto col-span-2"
              >
                {diseaseTypes.map((disease: any) => (
                  <SelectItem key={disease.name}>{disease.name}</SelectItem>
                ))}
              </Select>

              {/* Treatment Plan */}
              <Textarea
                placeholder="Mô tả phương pháp điều trị (thuốc, liệu pháp, thay đổi lối sống)"
                label="Kế Hoạch Điều Trị"
                value={consultation.treatment_plan}
                onChange={(e) => handleInputChange("treatment_plan", e.target.value)}
                className="w-full overflow-auto col-span-2"
              />

              {/* Prescription Checkbox */}
              <Checkbox
                isSelected={havePrescriptions}
                onValueChange={setHavePrescriptions}
                className="col-span-2"
              >
                Có đơn thuốc
              </Checkbox>

              {/* Medicine Section */}
              {havePrescriptions && (
                <div className="w-full border rounded-lg bg-gray-50 p-4 col-span-2">
                  <MedicineTable
                    selectedIds={selectedMedicineIDs}
                    medicines={medicineTypes}
                    setPrescriptions={setPrescriptions}
                  />
                  <Select
                    placeholder="Chọn các loại thuốc"
                    label="Các loại thuốc"
                    selectionMode="multiple"
                    onChange={handleSetSelectedMedicineIDs}
                    className="w-full overflow-auto col-span-2 mt-4"
                  >
                    {medicineTypes.map((medicineType: any) => (
                      <SelectItem key={medicineType.id}>
                        {medicineType.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              )}

              {/* Follow-up Instructions */}
              <Textarea
                placeholder="Hướng dẫn tái khám hoặc các bước tiếp theo (nếu cần)"
                label="Hướng Dẫn Tái Khám"
                value={consultation.follow_up_instructions || ""}
                onChange={(e) => handleInputChange("follow_up_instructions", e.target.value)}
                className="w-full overflow-auto col-span-2"
              />

              {/* Recommendations */}
              <Textarea
                placeholder="Các khuyến nghị khác của bác sĩ (chế độ ăn, tập luyện)"
                label="Khuyến Nghị"
                value={consultation.recommendations || ""}
                onChange={(e) => handleInputChange("recommendations", e.target.value)}
                className="w-full overflow-auto col-span-2"
              />

              {/* Notes */}
              <Textarea
                placeholder="Ghi chú bổ sung của bác sĩ (nếu cần)"
                label="Ghi Chú"
                value={consultation.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="w-full overflow-auto col-span-2"
              />

              {/* Save Button */}
              <div className="w-full flex justify-end items-center col-span-2">
                <Button
                  color="primary"
                  className="max-w-lg text-lg bg-[#58D68D] text-[#34495E]"
                  size="lg"
                  onPress={handleCreateConsultation}
                  isLoading={isSaving}
                  disabled={isSaving}
                >
                  {isSaving ? "Đang lưu..." : "Lưu chuẩn đoán"}
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
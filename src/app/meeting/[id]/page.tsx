"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAppointmentByID,
  putAppointmentStatus,
} from "@/services/appointments/functions";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
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
  prescription_id?: number | null; // ISO string for datetime
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
  const [appointment, setAppointment] = useState<any>(null);
  const [symptoms, setSymptoms] = useState<any>([]);
  const [diseaseTypes, setDiseaseTypes] = useState<any>([]);
  const [diagnosis, setDiagnosis] = useState<any>([]);
  const [medicineTypes, setMedicineTypes] = useState<any>([]);
  const [saved, setSave] = useState(false);
  const [havePrescriptions, setHavePrescriptions] = useState(false);
  const [consultation, setConsultation] = useState<Consultation>({
    appointment_id: parseInt(id),
    doctor_id: appointment?.doctor_id,
    patient_id: appointment?.patient_id,
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
  });
  const [selectedMedicineIDs, setSelectedMedicineIDs] = useState<string[]>([]);

  const [prescriptions, setPrescriptions] = useState<any>([]);

  useEffect(() => {
    if (id) {
      getAppointmentByID(parseInt(id)).then(setAppointment);
    }
  }, [id]);

  useEffect(() => {
    if (appointment && appointment.url) {
      putAppointmentStatus(appointment.id, "completed");
      setConsultation({
        ...consultation,
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id
      })
    }
  }, [appointment]);

  useEffect(() => {
    if (symptoms.length == 0) {
      handleFetchData();
    }
  }, [symptoms]);

  const handleFetchData = async () => {
    const symptomsData = await getAllSymptoms();
    setSymptoms(symptomsData);
    const diseaseTypesData = await getAllDiseaseTypes();
    setDiseaseTypes(diseaseTypesData);
    const diagnosisData = await getAllDiagnosis();
    setDiagnosis(diagnosisData);
    const medicineTypesData = await getAllMedicineTypes();
    setMedicineTypes(medicineTypesData);
  };

  const handleMultiSelectionChange = (
    e: any,
    key: "symptoms" | "disease_types" | "diagnosis" | "differential_diagnosis"
  ) => {
    const obj = { ...consultation };
    obj[key] = e.target.value;
    setConsultation(obj);
  };

  const handleSetSelectedMedicineIDs = (
    e: any
  ) => {
    setSelectedMedicineIDs(
      (e.target.value).split(",")
    )
  };

  const handleCreateConsultation = async () => {
    const data = await createConsultation(
      {
        consultations: consultation,
        prescriptions: prescriptions
      }
    )
    if (data.id) {
      setSave(true)
    }
  };

  if (!appointment) return <p>Đang tải...</p>;
  if (!appointment.url) return <p>Không tìm thấy URL meeting</p>;

  return (
    <>
      <Header />
      <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">
        <section className="w-full min-h-screen max-w-screen-xl py-10 bg-white">
          <button
            onClick={() => router.back()}
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
            ></iframe>
          </div>
        </section>
        {
          tokenDecode.role == "doctor"
          ?
          <section className="w-full max-w-screen-xl py-10  bg-white">
            <div className="my-4">
              <h2 className="text-2xl font-bold">
                Chẩn đoán{" "}
                <span
                  className={`py-1 px-2  rounded-lg text-white italic font-normal text-sm ${
                    saved ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {saved ? "Đã lưu" : "Chưa lưu"}
                </span>{" "}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <Textarea
                placeholder="Mô tả ngắn gọn lý do bệnh nhân đến khám (triệu chứng chính)"
                label="Lý Do Tư Vấn / Khám"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setConsultation({
                    ...consultation,
                    chief_complaint: e.target.value,
                  });
                }}
                className="w-full overflow-auto col-span-2"
              />
              <Textarea
                placeholder="Tiền sử bệnh lý của bệnh nhân (bệnh mãn tính, dị ứng, phẫu thuật)"
                label="Tiền Sử Bệnh Lý"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setConsultation({
                    ...consultation,
                    medical_history: e.target.value,
                  });
                }}
                className="w-full overflow-auto col-span-2"
              />
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
              <Select
                placeholder="Các chẩn đoán khác có thể xem xét (nếu có)"
                label="Chẩn Đoán Khác"
                selectionMode="multiple"
                onChange={(e) =>
                  handleMultiSelectionChange(e, "differential_diagnosis")
                }
                className="w-full overflow-auto col-span-2"
              >
                {diagnosis.map((disease: any) => (
                  <SelectItem key={disease.name}>{disease.name}</SelectItem>
                ))}
              </Select>
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
              <Textarea
                placeholder="Mô tả phương pháp điều trị (thuốc, liệu pháp, thay đổi lối sống)"
                label="Kế Hoạch Điều Trị"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setConsultation({
                    ...consultation,
                    treatment_plan: e.target.value,
                  });
                }}
                className="w-full overflow-auto col-span-2"
              />
              {/* <Textarea
                placeholder="Danh sách thuốc kê đơn (tên thuốc, liều lượng, cách dùng)"
                label="Đơn thuốc"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPrescriptions({
                    ...prescriptions,
                    medication: e.target.value,
                  });
                }}
                className="w-full overflow-auto col-span-2"
              /> */}
              <Checkbox
                isSelected={havePrescriptions}
                onValueChange={setHavePrescriptions}
              >
                Có đơn thuốc
              </Checkbox>
              {havePrescriptions && (
                <div className="w-full border rounded-lg bg-gray-50 p-4 col-span-2">
                  <MedicineTable selectedIds={selectedMedicineIDs} medicines={medicineTypes} setPrescriptions={setPrescriptions}/>
                  <Select
                    placeholder="Chọn các loại thuốc"
                    label="Các loại thuốc"
                    selectionMode="multiple"
                    onChange={(e) => handleSetSelectedMedicineIDs(e)}
                    className="w-full overflow-auto col-span-2 mt-4"
                  >
                    {medicineTypes.map((medicineType: any) => (
                      <SelectItem key={medicineType.id}>{medicineType.name}</SelectItem>
                    ))}
                  </Select>
                </div>
              )}
              <Textarea
                placeholder="Hướng dẫn tái khám hoặc các bước tiếp theo (nếu cần)"
                label="Hướng Dẫn Tái Khám"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setConsultation({
                    ...consultation,
                    follow_up_instructions: e.target.value,
                  });
                }}
                className="w-full overflow-auto col-span-2"
              />
              <Textarea
                placeholder="Các khuyến nghị khác của bác sĩ (chế độ ăn, tập luyện)"
                label="Khuyến Nghị"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setConsultation({
                    ...consultation,
                    recommendations: e.target.value,
                  });
                }}
                className="w-full overflow-auto col-span-2"
              />
              <Textarea
                placeholder="Ghi chú bổ sung của bác sĩ (nếu cần)"
                label="Ghi Chú"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setConsultation({
                    ...consultation,
                    notes: e.target.value,
                  });
                }}
                className="w-full overflow-auto col-span-2"
              />
              <div className="w-full flex justify-end items-center col-span-2">
                <Button
                  color="primary"
                  className="max-w-lg text-lg bg-[#58D68D] text-[#34495E]"
                  size="lg"
                  onPress={() => {
                    handleCreateConsultation()
                  }}
                >
                  Lưu chuẩn đoán
                </Button>
              </div>
            </div>
          </section>
          :
          <></>
        }
      </div>
      <Footer />
    </>
  );
}

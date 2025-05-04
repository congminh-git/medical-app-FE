"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";

export default function DoctorCard({
  doctor,
  allSpecialties,
}: {
  doctor: any;
  allSpecialties: any;
}) {
  return (
    <a href={`/doctors/${doctor.user_id}/profile`}>
      <div key={doctor.id} className="h-[520px]">
        <Card className="hover:cursor-pointer hover:translate-x-2 hover:-translate-y-2 hover:grayscale py-4 h-full z-0">
          <CardHeader className="h-4/5 pb-2 pt-0 px-4 flex-col items-start">
            <div
              className="h-full w-full rounded-md"
              style={{
                backgroundImage: doctor?.user?.image ? `url('${doctor?.user?.image}')` : "",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </CardHeader>
          <CardBody className="overflow-hidden pt-0 pb-2">
            <h4 className="font-bold text-large text-center flex items-center justify-between my-1 text-[#2C3E50] whitespace-nowrap text-ellipsis">
              {doctor.user.full_name}
              <Chip isDisabled color="primary">
                {allSpecialties.find(
                  (item: any) => item.id === doctor.specialty_id
                )?.name || "Không rõ"}
              </Chip>
            </h4>
            <div className="mt-1 text-sm">
              <p className="overflow-hidden text-ellipsis line-clamp-2 whitespace-nowrap">
                <span className="font-semibold">Làm việc tại:</span>{" "}
                {doctor.workplace}
              </p>
              <p className="overflow-hidden text-ellipsis line-clamp-2 whitespace-nowrap">
                <span className="font-semibold">Học vấn:</span>{" "}
                {doctor.education}
              </p>
              <p className="overflow-hidden text-ellipsis line-clamp-2 whitespace-nowrap">
                <span className="font-semibold">Phí tư vấn:</span>{" "}
                <span className="font-bold text-orange-500 ml-2">
                  {parseInt(doctor.consultation_fee)?.toLocaleString()}đ
                </span>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </a>
  );
}

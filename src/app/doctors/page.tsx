"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import { useAuth } from "@/hooks/useAuth";
import { getAllDoctors } from "@/services/doctors/functions";
import { getAllSpecialties } from "@/services/specialties/functions";
import DoctorCard from "@/components/doctors/doctorCard";

export default function DoctorsPage() {
  useAuth();
  const newDoctorsRef = useRef<HTMLElement | null>(null);
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [originalDoctors, setOriginalDoctors] = useState<any[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<any[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("new");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;
  const totalPages = Math.ceil(allDoctors.length / itemsPerPage);
  const displayedDoctors = allDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchData = async () => {
      const doctors = await getAllDoctors();
      setAllDoctors(doctors);
      setOriginalDoctors(doctors); // Lưu danh sách gốc để filter
      const specialties = await getAllSpecialties();
      setAllSpecialties(specialties);
    };
    fetchData();
  }, []);

  const handleSpecialtyChange = (specialtyKey: string) => {
    setSelectedSpecialty(specialtyKey);
    setCurrentPage(1);
    let filteredDoctors = originalDoctors;
    if (specialtyKey !== "all" && specialtyKey) {
      filteredDoctors = originalDoctors.filter((doctor: any) =>
        doctor.specialty_id == specialtyKey
      );
    }
    applySorting(filteredDoctors);
  };

  const handleSortChange = (sortKey: string) => {
    setSortOption(sortKey);
    applySorting(allDoctors, sortKey);
  };

  const applySorting = (doctors: any[], sortKey = sortOption) => {
    let sortedDoctors = [...doctors];
    if (sortKey === "fee-asc") {
      sortedDoctors.sort((a, b) => a.consultation_fee - b.consultation_fee);
    } else if (sortKey === "fee-desc") {
      sortedDoctors.sort((a, b) => b.consultation_fee - a.consultation_fee);
    } else {
      sortedDoctors.sort((a, b) => new Date(b.user.created_at).getTime() - new Date(a.user.created_at).getTime());
    }
    setAllDoctors(sortedDoctors);
  };

  return (
    <>
      <Header />

      <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">
        <section
          ref={newDoctorsRef}
          className="w-full max-w-screen-xl py-10  bg-white flex justify-center items-center flex-wrap"
        >
          <div className="w-full flex justify-end gap-4 mb-4">
            <Select
              className="max-w-xs z-0"
              variant="bordered"
              label="Chuyên khoa"
              selectedKeys={[selectedSpecialty]}
              onChange={(e) => handleSpecialtyChange(e.target.value)}
            >
              <SelectItem key="all">Tất cả chuyên khoa</SelectItem>
              <>
              {allSpecialties?.map((specialty: any) => (
                <SelectItem key={specialty.id}>{specialty.name}</SelectItem>
              ))}
              </>
            </Select>

            <Select
              className="max-w-xs z-0"
              variant="bordered"
              label="Sắp xếp theo"
              selectedKeys={[sortOption]}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <SelectItem key="new">Mới nhất</SelectItem>
              <SelectItem key="fee-asc">Phí tư vấn tăng dần</SelectItem>
              <SelectItem key="fee-desc">Phí tư vấn giảm dần</SelectItem>
            </Select>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4 w-full">
            {displayedDoctors.map((doctor: any) => (
              <DoctorCard doctor={doctor} allSpecialties={allSpecialties}/>
            ))}
          </div>
          <div className="mt-8 w-full flex justify-end">
            <Pagination
              showControls
              total={totalPages}
              initialPage={1}
              page={currentPage}
              onChange={(page) => setCurrentPage(page)}
              variant="bordered"
            />
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import { useAuth } from "@/hooks/useAuth";
import { getAllDoctors } from "@/services/doctors/functions";
import { getAllSpecialties } from "@/services/specialties/functions";
import DoctorCard from "@/components/doctors/doctorCard";
import PageFallback from "@/components/fallback";

interface Doctor {
  id: string;
  specialty_id: string;
  consultation_fee: number;
  user: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  };
  [key: string]: any;
}

interface Specialty {
  id: string;
  name: string;
}

// Constants
const ITEMS_PER_PAGE = 12;
const MINIMUM_LOADING_TIME = 500; // 0.5 giây
const SORT_OPTIONS = [
  { key: "new", label: "Mới nhất" },
  { key: "fee-asc", label: "Phí tư vấn tăng dần" },
  { key: "fee-desc", label: "Phí tư vấn giảm dần" },
] as const;

type SortType = (typeof SORT_OPTIONS)[number]["key"];

export default function DoctorsPage() {
  useAuth();

  const newDoctorsRef = useRef<HTMLElement | null>(null);
  const [originalDoctors, setOriginalDoctors] = useState<Doctor[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortType>("new");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch data với guaranteed minimum loading time
  const fetchData = useCallback(async () => {
    console.log("🔄 Bắt đầu fetch doctors data...");
    setIsLoading(true);

    const startTime = Date.now();

    try {
      const [doctors, specialties] = await Promise.all([
        getAllDoctors(),
        getAllSpecialties(),
      ]);

      console.log("✅ Doctors data fetched successfully:", {
        doctors: doctors?.length,
        specialties: specialties?.length,
      });

      // Tính thời gian đã trôi qua
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsedTime);

      console.log(
        `⏱️ Elapsed time: ${elapsedTime}ms, remaining time: ${remainingTime}ms`
      );

      // Đảm bảo loading ít nhất MINIMUM_LOADING_TIME
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      setOriginalDoctors((doctors as Doctor[]) || []);
      setAllSpecialties((specialties as Specialty[]) || []);
    } catch (error) {
      console.error("❌ Error fetching doctors data:", error);

      // Ngay cả khi có lỗi, vẫn đảm bảo minimum loading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsedTime);

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
    } finally {
      console.log("🏁 Kết thúc fetch doctors data");
      setIsLoading(false);
    }
  }, []);

  // Memoize filtered doctors by specialty
  const filteredDoctors = useMemo(() => {
    if (selectedSpecialty === "all") {
      return originalDoctors;
    }

    return originalDoctors.filter(
      (doctor) => doctor.specialty_id === selectedSpecialty
    );
  }, [originalDoctors, selectedSpecialty]);

  // Memoize sorted doctors
  const sortedDoctors = useMemo(() => {
    const doctors = [...filteredDoctors];

    switch (sortOption) {
      case "fee-asc":
        return doctors.sort(
          (a, b) => (a.consultation_fee || 0) - (b.consultation_fee || 0)
        );
      case "fee-desc":
        return doctors.sort(
          (a, b) => (b.consultation_fee || 0) - (a.consultation_fee || 0)
        );
      case "new":
      default:
        return doctors.sort((a, b) => {
          const dateA = new Date(a.user?.created_at || 0);
          const dateB = new Date(b.user?.created_at || 0);
          return dateB.getTime() - dateA.getTime();
        });
    }
  }, [filteredDoctors, sortOption]);

  // Memoize paginated doctors
  const paginatedDoctors = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedDoctors.slice(startIndex, endIndex);
  }, [sortedDoctors, currentPage]);

  // Memoize total pages
  const totalPages = useMemo(() => {
    return Math.ceil(sortedDoctors.length / ITEMS_PER_PAGE);
  }, [sortedDoctors.length]);

  // Memoize specialty name lookup
  const getSpecialtyName = useMemo(() => {
    const specialtyMap = new Map(allSpecialties.map((s) => [s.id, s.name]));
    return (specialtyId: string) => specialtyMap.get(specialtyId) || "Unknown";
  }, [allSpecialties]);

  // Memoized event handlers
  const handleSpecialtyChange = useCallback((specialtyKey: string) => {
    console.log("🔄 Specialty changed:", specialtyKey);
    setSelectedSpecialty(specialtyKey);
    setCurrentPage(1); // Reset to first page
  }, []);

  const handleSortChange = useCallback((sortKey: string) => {
    console.log("🔄 Sort changed:", sortKey);
    setSortOption(sortKey as SortType);
    setCurrentPage(1); // Reset to first page
  }, []);

  const handlePageChange = useCallback((page: number) => {
    console.log("🔄 Page changed:", page);
    setCurrentPage(page);
  }, []);

  // Initial data fetch
  useEffect(() => {
    console.log("🚀 Doctors component mounted, calling fetchData");
    fetchData();
  }, [fetchData]);

  // Debug log for loading state
  console.log("🔍 Current doctors loading state:", isLoading);

  // Loading state
  if (isLoading) {
    console.log("📱 Rendering Doctors PageFallback...");
    return <PageFallback />;
  }

  console.log("📱 Rendering doctors main content...", {
    totalDoctors: originalDoctors.length,
    filteredDoctors: sortedDoctors.length,
    currentPage,
    totalPages,
  });

  return (
    <>
      <Header />

      <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">
        <section
          ref={newDoctorsRef}
          className="w-full max-w-screen-xl py-10 bg-white flex justify-center items-center flex-wrap"
        >
          {/* Filter Controls */}
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
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>
          </div>

          {/* Results Summary */}
          <div className="w-full flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Hiển thị {paginatedDoctors.length} / {sortedDoctors.length} bác sĩ
            </div>

            {selectedSpecialty !== "all" && (
              <div className="text-sm text-blue-600">
                Chuyên khoa: {getSpecialtyName(selectedSpecialty)}
              </div>
            )}
          </div>

          {/* Doctors Grid */}
          {paginatedDoctors.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
              {paginatedDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  allSpecialties={allSpecialties}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 w-full text-center py-20">
              <div className="text-gray-500 text-lg">
                {originalDoctors.length === 0
                  ? "Chưa có bác sĩ nào"
                  : "Không tìm thấy bác sĩ phù hợp với bộ lọc"}
              </div>
              {sortedDoctors.length === 0 && originalDoctors.length > 0 && (
                <div className="text-gray-400 text-sm mt-2">
                  Thử thay đổi chuyên khoa hoặc bộ lọc khác
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 w-full flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages}
              </div>

              <Pagination
                showControls
                total={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                variant="bordered"
                className="z-0"
              />
            </div>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
}

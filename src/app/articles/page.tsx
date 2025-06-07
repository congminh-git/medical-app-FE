"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import { DateRangePicker } from "@heroui/date-picker";
import { useAuth } from "@/hooks/useAuth";
import { getAllArticles } from "@/services/articles/functions";
import { getAllSpecialties } from "@/services/specialties/functions";
import ArticleCard from "@/components/articles/articleCard";
import PageFallback from "@/components/fallback";

interface Article {
  id: string;
  doctor_id: string;
  specialties: string;
  title: string;
  content: string;
  views: number;
  likes: string;
  created_at: string;
}

interface Specialty {
  name: string;
  id: string;
}

// Constants
const ITEMS_PER_PAGE = 12;
const MINIMUM_LOADING_TIME = 500; // 0.5 giây
const SORT_OPTIONS = [
  { key: "new", label: "Mới" },
  { key: "popular", label: "Được yêu thích nhất" },
  { key: "trending", label: "Được quan tâm nhất" },
] as const;

type SortType = (typeof SORT_OPTIONS)[number]["key"];

export default function ArticlesPage() {
  useAuth();

  const newArticlesRef = useRef<HTMLElement | null>(null);
  const [originalArticles, setOriginalArticles] = useState<Article[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortType, setSortType] = useState<SortType>("new");
  const [dateRange, setDateRange] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch data với guaranteed minimum loading time
  const fetchData = useCallback(async () => {
    console.log("🔄 Bắt đầu fetch articles data...");
    setIsLoading(true);

    const startTime = Date.now();

    try {
      const [articles, specialties] = await Promise.all([
        getAllArticles(),
        getAllSpecialties(),
      ]);

      console.log("✅ Articles data fetched successfully:", {
        articles: articles?.length,
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

      setOriginalArticles((articles as Article[]) || []);
      setAllSpecialties((specialties as Specialty[]) || []);
    } catch (error) {
      console.error("❌ Error fetching articles data:", error);

      // Ngay cả khi có lỗi, vẫn đảm bảo minimum loading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsedTime);

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
    } finally {
      console.log("🏁 Kết thúc fetch articles data");
      setIsLoading(false);
    }
  }, []);

  // Memoize filtered articles by specialty
  const specialtyFilteredArticles = useMemo(() => {
    if (selectedSpecialty === "all") {
      return originalArticles;
    }

    return originalArticles.filter((article) =>
      article.specialties?.includes(selectedSpecialty)
    );
  }, [originalArticles, selectedSpecialty]);

  // Memoize date filtered articles
  const dateFilteredArticles = useMemo(() => {
    if (!dateRange?.start || !dateRange?.end) {
      return specialtyFilteredArticles;
    }

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999);

    return specialtyFilteredArticles.filter((article) => {
      const articleDate = new Date(article.created_at);
      return articleDate >= startDate && articleDate <= endDate;
    });
  }, [specialtyFilteredArticles, dateRange]);

  // Memoize sorted articles
  const sortedArticles = useMemo(() => {
    const articles = [...dateFilteredArticles];

    switch (sortType) {
      case "new":
        return articles.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "popular":
        return articles.sort((a, b) => {
          const likesA = (a.likes || "").split(", ").filter(Boolean).length;
          const likesB = (b.likes || "").split(", ").filter(Boolean).length;
          return likesB - likesA;
        });
      case "trending":
        return articles.sort((a, b) => (b.views || 0) - (a.views || 0));
      default:
        return articles;
    }
  }, [dateFilteredArticles, sortType]);

  // Memoize paginated articles
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedArticles.slice(startIndex, endIndex);
  }, [sortedArticles, currentPage]);

  // Memoize total pages
  const totalPages = useMemo(() => {
    return Math.ceil(sortedArticles.length / ITEMS_PER_PAGE);
  }, [sortedArticles.length]);

  // Memoized event handlers
  const handleSpecialtyChange = useCallback((specialtyKey: string) => {
    console.log("🔄 Specialty changed:", specialtyKey);
    setSelectedSpecialty(specialtyKey);
    setCurrentPage(1); // Reset to first page
  }, []);

  const handleSortChange = useCallback((sortKey: string) => {
    console.log("🔄 Sort changed:", sortKey);
    setSortType(sortKey as SortType);
    setCurrentPage(1); // Reset to first page
  }, []);

  const handleDateRangeChange = useCallback((newDateRange: any) => {
    console.log("🔄 Date range changed:", newDateRange);
    setDateRange(newDateRange);
    setCurrentPage(1); // Reset to first page
  }, []);

  const handlePageChange = useCallback((page: number) => {
    console.log("🔄 Page changed:", page);
    setCurrentPage(page);
  }, []);

  // Initial data fetch
  useEffect(() => {
    console.log("🚀 Articles component mounted, calling fetchData");
    fetchData();
  }, [fetchData]);

  // Debug log for loading state
  console.log("🔍 Current articles loading state:", isLoading);

  // Loading state
  if (isLoading) {
    console.log("📱 Rendering Articles PageFallback...");
    return <PageFallback />;
  }

  console.log("📱 Rendering articles main content...", {
    totalArticles: originalArticles.length,
    filteredArticles: sortedArticles.length,
    currentPage,
    totalPages,
  });

  return (
    <>
      <Header />

      <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">
        <section
          ref={newArticlesRef}
          className="w-full max-w-screen-xl py-10 bg-white flex justify-center items-center flex-wrap"
        >
          {/* Filter Controls */}
          <div className="w-full flex justify-end gap-4 mb-4">
            <DateRangePicker
              className="max-w-xs z-0"
              label="Khoảng thời gian"
              variant="bordered"
              onChange={handleDateRangeChange}
            />

            <Select
              className="max-w-xs z-0"
              variant="bordered"
              label="Sắp xếp"
              selectedKeys={[sortType]}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.key}>{option.label}</SelectItem>
              ))}
            </Select>

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
                  <SelectItem key={specialty?.name}>
                    {specialty?.name}
                  </SelectItem>
                ))}
              </>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="w-full flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Hiển thị {paginatedArticles.length} / {sortedArticles.length} bài
              viết
            </div>

            {(selectedSpecialty !== "all" || dateRange?.start) && (
              <div className="text-sm text-blue-600">
                {selectedSpecialty !== "all" &&
                  `Chuyên khoa: ${selectedSpecialty}`}
                {selectedSpecialty !== "all" && dateRange?.start && " | "}
                {dateRange?.start && "Có lọc theo ngày"}
              </div>
            )}
          </div>

          {/* Articles Grid */}
          {paginatedArticles.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {paginatedArticles.map((article, index) => (
                <ArticleCard
                  article={article}
                  key={`${article.id}-${index}`} // Better key using article id
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 w-full text-center py-20">
              <div className="text-gray-500 text-lg">
                {originalArticles.length === 0
                  ? "Chưa có bài viết nào"
                  : "Không tìm thấy bài viết phù hợp với bộ lọc"}
              </div>
              {sortedArticles.length === 0 && originalArticles.length > 0 && (
                <div className="text-gray-400 text-sm mt-2">
                  Thử thay đổi bộ lọc hoặc khoảng thời gian
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

"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Select, SelectItem } from "@heroui/select";
import { Pagination } from "@heroui/pagination";
import { DateRangePicker } from "@heroui/date-picker";
import { useAuth } from "@/hooks/useAuth";
import { getAllArticles } from "@/services/articles/functions";
import { getAllSpecialties } from "@/services/specialties/functions";
import ArticleCard from "@/components/articles/articleCard";

export default function ArticlesPage() {
  useAuth();
  const newArticlesRef = useRef<HTMLElement | null>(null);
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [originalArticles, setOriginalArticles] = useState<any[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<any[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("new");
  const [dateRange, setDateRange] = useState<any>();
  const itemsPerPage = 12;

  useEffect(() => {
    handleGetAllArticles();
    handleGetAllSpecialties();
  }, []);

  useEffect(() => {
    if (dateRange?.start && dateRange?.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);

      const filteredArticles = originalArticles.filter((article) => {
        const articleDate = new Date(article.created_at);
        return articleDate >= startDate && articleDate <= endDate;
      });

      setAllArticles(filteredArticles);
      setCurrentPage(1);
    }
  }, [dateRange, originalArticles]);

  const handleGetAllArticles = async () => {
    const articles = await getAllArticles();
    // const sortedArticles = articles.sort(
    //   (a:any, b:any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    // );
    setAllArticles(articles);
    setOriginalArticles(articles);
  };

  const handleGetAllSpecialties = async () => {
    const specialties = await getAllSpecialties();
    setAllSpecialties(specialties);
  };

  const handleSpecialtyChange = (specialtyKey: string) => {
    setSelectedSpecialty(specialtyKey);
    if (specialtyKey === "all") {
      setAllArticles(originalArticles);
    } else {
      const filteredArticles = originalArticles.filter((article) =>
        article.specialties?.includes(specialtyKey)
      );
      setAllArticles(filteredArticles);
    }
    setCurrentPage(1);
  };

  const handleSortChange = (sortKey: string) => {
    setSortType(sortKey);
    const sortedArticles = [...allArticles];

    switch (sortKey) {
      case "new":
        sortedArticles.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "popular":
        sortedArticles.sort((a, b) => {
          const likesA = (a.likes || "").split(", ").length;
          const likesB = (b.likes || "").split(", ").length;
          return likesB - likesA;
        });
        break;
      case "trending":
        sortedArticles.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    setAllArticles(sortedArticles);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(allArticles.length / itemsPerPage);
  const displayedArticles = allArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <Header />

      <div className="bg-white mm flex justify-center flex-wrap mt-[120px]">
        <section
          ref={newArticlesRef}
          className="w-full max-w-screen-xl py-10  bg-white flex justify-center items-center flex-wrap"
        >
          <div className="w-full flex justify-end gap-4 mb-4">
            <DateRangePicker
              className="max-w-xs z-0"  
              label="Stay duration"
              variant="bordered"
              onChange={setDateRange}
            />

            <Select
              className="max-w-xs z-0"
              variant="bordered"
              label="Sắp xếp"
              selectedKeys={[sortType]}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <SelectItem key="new">Mới</SelectItem>
              <SelectItem key="popular">Được yêu thích nhất</SelectItem>
              <SelectItem key="trending">Được quan tâm nhất</SelectItem>
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

          <div className="mt-6 grid grid-cols-3 gap-4 w-full">
            {displayedArticles.map((article: any, index:number) => (
              <ArticleCard article={article} key={index}/>
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

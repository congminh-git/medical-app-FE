"use client";

import AdminSideBar from "@/components/adminSideBar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { getAllArticles } from "@/services/articles/functions";
import { useAsyncList } from "@react-stately/data";
import { TrashIcon } from "@heroicons/react/24/outline";
import { getAllSpecialties } from "@/services/specialties/functions";
import { Select, SelectItem } from "@heroui/select";

interface Article {
  id: string;
  doctor_id: string;
  specialties: string;
  title: string;
  content: string;
  views: string;
  likes: string;
  created_at: string;
}

interface Column {
  name: string;
  uid: keyof Article | "actions";
  sortable?: boolean;
}

export default function AdminArticlesPage() {
  const [allArticleData, setAllArticleData] = useState<Article[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<any[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const rowsPerPage = 25;

  const fetchData = async () => {
    const users = await getAllArticles();
    setAllArticleData((users as Article[]) || []);
    const specialties = await getAllSpecialties();
    setAllSpecialties(specialties);
  };

  const list = useAsyncList<Article>({
    async load() {
      return { items: allArticleData };
    },
    async sort({
      items,
      sortDescriptor,
    }: {
      items: Article[];
      sortDescriptor: SortDescriptor;
    }) {
      return {
        items: items.sort((a, b) => {
          if (sortDescriptor.column === "created_at") {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortDescriptor.direction === "ascending"
              ? dateA.getTime() - dateB.getTime()
              : dateB.getTime() - dateA.getTime();
          }
          return 0;
        }),
      };
    },
  });

  useEffect(() => {
    list.reload();
  }, [allArticleData]);

  const filteredData = useMemo(() => {
    let filteredItems = list.items;
  
    // Lọc theo searchQuery
    if (searchQuery) {
      filteredItems = filteredItems.filter((item: Article) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    // Lọc theo selectedSpecialty
    if (selectedSpecialty) {
      filteredItems = filteredItems.filter((item: Article) =>
        item.specialties === selectedSpecialty
      );
    }
  
    return filteredItems;
  }, [list.items, searchQuery, selectedSpecialty]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, []);

  const renderArticleCell = (
    data: Article,
    columnKey: keyof Article | "actions"
  ) => {
    const cellValue = columnKey !== "actions" ? data[columnKey] : undefined;
    switch (columnKey) {
      case "created_at":
        const createDate = new Date(cellValue as string);
        return createDate.toLocaleString();
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <div className="flex justify-center gap-4">
              {/* <div className="relative group">
                <button aria-label="Chỉnh sửa">
                  <PencilSquareIcon className="h-5 w-5 text-yellow-500" />
                </button>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Chỉnh sửa
                </span>
              </div> */}
              <div className="relative group">
                <button aria-label="Xóa">
                  <TrashIcon className="h-5 w-5 text-red-500" />
                </button>
                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Xóa
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const columns: Column[] = [
    { name: "ID", uid: "id" },
    { name: "ID Bác sĩ", uid: "doctor_id" },
    { name: "Chuyên khoa", uid: "specialties" },
    { name: "Tiêu đề", uid: "title" },
    { name: "Nội dung", uid: "content" },
    { name: "Views", uid: "views" },
    { name: "Likes", uid: "likes" },
    { name: "Ngày tạo", uid: "created_at", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  return (
    <>
      <Header />
      <div className="flex items-start w-screen mt-[90px]">
        <AdminSideBar />
        <div className="flex-1 min-h-screen p-8 bg-[#D5DBDB] box-border">
          <div className="w-full min-h-screen border rounded-lg bg-white p-6 box-border">
            <h1 className="text-3xl font-bold ">Quản lý bài viết</h1>
            {/* Search Input */}
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center justify-start gap-4">
                <Input
                  placeholder="Tìm kiếm theo tiêu đề..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="max-w-xs"
                />
                {allSpecialties ? (
                  <Select
                    className="max-w-xs"
                    placeholder="Chọn chuyên khoa"
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                  >
                    {allSpecialties.map((specialties) => (
                      <SelectItem key={specialties.name}>
                        {specialties.name}
                      </SelectItem>
                    ))}
                  </Select>
                ) : (
                  <></>
                )}
              </div>

              {/* <Button
                color="primary"
                className="w-fit text-lg bg-[#58D68D] text-[#34495E]"
                size="lg"
              >
                Thêm mới
              </Button> */}
            </div>

            {allArticleData.length > 0 ? (
              <>
                <Table
                  isStriped
                  aria-label="Article table with pagination and sorting"
                  sortDescriptor={list.sortDescriptor}
                  onSortChange={list.sort}
                >
                  <TableHeader columns={columns}>
                    {(column: Column) => (
                      <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                      >
                        {column.name}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody items={paginatedData}>
                    {(item: Article) => (
                      <TableRow key={item.id}>
                        {(columnKey: any) => (
                          <TableCell>
                            {renderArticleCell(item, columnKey)}
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-end mt-4">
                  <Pagination
                    className="z-0"
                    total={totalPages}
                    page={page}
                    onChange={setPage}
                    showControls
                    isCompact
                  />
                </div>
              </>
            ) : (
              <p>Loading....</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

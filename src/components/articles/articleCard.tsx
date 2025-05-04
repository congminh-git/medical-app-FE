"use client";

import { formatDateTime, generateSlug } from "@/services/reUseFunctions";
import { EyeIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useEffect, useState } from "react";

export default function ArticleCard({ article }: { article: any }) {
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (article) {
      const genSlug = generateSlug(article.title, article.id);
      setSlug(genSlug);
    }
  }, [article]);
  return (
    <a href={`/articles${slug}`}>
      <div className="h-[500px]" key={article?.id}>
        <Card className="hover:cursor-pointer hover:translate-x-2 hover:-translate-y-2 hover:grayscale py-4 h-full z-0">
          <CardHeader className="h-3/5 pb-2 pt-0 px-4 flex-col items-start">
            <div className={`h-full w-full rounded-md bg-cover bg-center`}
                style={{
                  backgroundImage: article?.image? `url('${article?.image}')` : "",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}>
            </div>
          </CardHeader>
          <CardBody className="overflow-hidden pt-0 pb-2">
            <div className="mt-1 flex justify-start mb-2 gap-2">
              {article?.specialties?.split(",").map((item: string) => (
                <Chip isDisabled color="primary" key={item}>
                  {item}
                </Chip>
              ))}
            </div>
            <h4 className="font-bold text-xl text-[#2C3E50] whitespace-nowrap overflow-hidden text-ellipsis">
              {article?.title}
            </h4>
            <p className="font-bold text-sm text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
              {article?.created_at ? formatDateTime(article?.created_at) : ""}
            </p>
            <p className="text-md flex justify-start items-center gap-4 my-1 font-bold text-[#2C3E50] whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="flex items-center gap-2">
                <EyeIcon className="h-4 w-4" /> {article?.views}
              </span>{" "}
              <span className="flex items-center gap-2">
                {" "}
                <HandThumbUpIcon className="h-4 w-4" /> {article?.likes ? article.likes.split(", ").length : 0 }
              </span>
            </p>
            <div
              className="text-[#34495E] overflow-hidden text-ellipsis max-h-[60px] text-sm flex-grow"
              dangerouslySetInnerHTML={{ __html: article?.content }}
            ></div>
          </CardBody>
        </Card>
      </div>
    </a>
  );
}

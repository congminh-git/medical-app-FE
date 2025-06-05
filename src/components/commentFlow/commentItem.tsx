"use client";

import type { Comment } from "@/interfaces/comment";
import Image from "next/image";
import { format } from "date-fns";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { formatDateTime } from "@/services/reUseFunctions";

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className="flex space-x-3 p-4 bg-card rounded-lg shadow-md border border-border">
      <div
        className="w-16 h-16 border rounded-full"
        style={{
          backgroundImage: comment?.patient?.image
            ? `url('${comment?.patient.image}')`
            : "",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-lg font-headline font-semibold text-foreground">
            {comment?.patient?.full_name}
          </h4>
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarDaysIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
            <span>{formatDateTime(comment.created_at ? comment.created_at : '')}</span>
          </div>
        </div>
        <p className="text-md text-foreground whitespace-pre-wrap">
          {comment.feedback}
        </p>
      </div>
    </div>
  );
};

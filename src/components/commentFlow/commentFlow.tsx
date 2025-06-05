"use client";

import { Comment, User } from '@/interfaces/comment';
import { useState } from 'react';
import { CommentItem } from './commentItem';
import { PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface CommentFlowProps {
  comments: Comment[];
  currentUser: User;
  onCommentSubmit: (commentData: { userId: string; content: string }) => Promise<void>;
}

export const CommentFlow: React.FC<CommentFlowProps> = ({ comments, currentUser, onCommentSubmit }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      await onCommentSubmit({
        userId: currentUser.id,
        content: newComment.trim(),
      });
      setNewComment('');
    } catch (error) {
      console.error("Failed to submit comment:", error);
      // As per prompt, no toast notifications. Error is logged to console.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-background text-foreground rounded-xl shadow-xl border border-border">
      <div className="flex items-center justify-start mb-6">
        <h2 className="text-3xl font-bold text-foreground">
          Cảm nhận của các bệnh nhân
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 border-t border-border pt-6">
        <div className="flex items-start space-x-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`Nhập đôi lời cảm nhận của bạn...`}
            className="flex-1 p-3 border border-input rounded-lg focus:border-transparent bg-card text-card-foreground resize-none shadow-sm text-md outline-none"
            rows={3}
            disabled={isSubmitting}
            aria-label="Write a comment"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="flex items-center justify-center px-6 py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-lg shadow-md hover:bg-opacity-85 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 ease-in-out transform active:scale-95"
          >
            {isSubmitting ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5 mr-2 transform -rotate-45" />
            )}
            {isSubmitting ? 'Đang gửi...' : 'Gửi cảm nhận'}
          </button>
        </div>
      </form>
      
      <div className="space-y-5 mb-8 max-h-[60vh] pr-2 mt-8">
        {comments.length === 0 && !isSubmitting && (
          <p className="text-muted-foreground text-center py-4">Chưa có bệnh nhân nào để lại cảm nhận, bạn hãy là người đầu tiên!</p>
        )}
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

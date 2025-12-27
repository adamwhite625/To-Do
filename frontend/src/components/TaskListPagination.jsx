import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TaskListPagination = ({ page, totalPages, handlePageChange }) => {
  // Logic tính toán số trang hiển thị (1, 2, ..., 5)
  const generatePages = () => {
    const pages = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page < 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 1) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page, "...", totalPages);
      }
    }
    return pages;
  };

  // Nếu không có trang nào hoặc chỉ có 1 trang thì không hiện
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-6 pb-10">
      <PaginationContent>
        {/* Nút Lùi */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => page > 1 && handlePageChange(page - 1)}
            className={
              page === 1
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer hover:bg-cyan-50 hover:text-[#00cec9]"
            }
          />
        </PaginationItem>

        {/* Các nút số */}
        {generatePages().map((p, index) => (
          <PaginationItem key={index}>
            {p === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={page === p}
                onClick={() => handlePageChange(p)}
                className={`cursor-pointer ${
                  page === p
                    ? "bg-[#81ecec] hover:bg-[#00cec9] text-slate-900 border-0"
                    : "hover:bg-cyan-50 hover:text-[#00cec9]"
                }`}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Nút Tiến */}
        <PaginationItem>
          <PaginationNext
            onClick={() => page < totalPages && handlePageChange(page + 1)}
            className={
              page === totalPages
                ? "opacity-50 pointer-events-none"
                : "cursor-pointer hover:bg-cyan-50 hover:text-[#00cec9]"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TaskListPagination;

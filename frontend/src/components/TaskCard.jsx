import React from "react";
import { Trash2, Check, Circle, Calendar } from "lucide-react"; // Thêm icon Calendar
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/axios";

// Nhận thêm prop onTaskChanged để báo cho HomePage tải lại danh sách
const TaskCard = ({ task, onTaskChanged }) => {
  // 1. Hàm xử lý đổi trạng thái (Active <-> Complete)
  const toggleStatus = async () => {
    try {
      const newStatus = task.status === "active" ? "complete" : "active";
      // Nếu hoàn thành thì lấy giờ hiện tại, nếu mở lại thì null
      const newCompletedAt =
        newStatus === "complete" ? new Date().toISOString() : null;

      await api.put(`/tasks/${task._id}`, {
        status: newStatus,
        completedAt: newCompletedAt,
      });

      toast.success(
        newStatus === "complete" ? "Đã hoàn thành! 🎉" : "Đã mở lại nhiệm vụ 💪"
      );

      // Báo ra ngoài để tải lại dữ liệu
      onTaskChanged();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  // 2. Hàm xử lý xóa
  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success("Đã xóa nhiệm vụ");
      onTaskChanged();
    } catch (error) {
      toast.error("Lỗi khi xóa");
    }
  };

  // Hàm format ngày giờ cho đẹp (Ví dụ: 10:30 - 20/10/2023)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card
      className={cn(
        "flex flex-col p-4 mb-3 transition-all border-gray-100 shadow-sm hover:shadow-md",
        task.status === "complete" ? "bg-gray-50/50" : "bg-white"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Nút Check Tròn */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "mt-1 rounded-full shrink-0 hover:bg-cyan-50 hover:text-[#00cec9]",
            task.status === "complete" ? "text-[#00cec9]" : "text-gray-400"
          )}
          onClick={toggleStatus} // Gắn hàm click vào đây
        >
          {task.status === "complete" ? (
            <Check className="h-6 w-6" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </Button>

        <div className="flex-1 min-w-0">
          {/* Tiêu đề */}
          <p
            className={cn(
              "text-base font-medium break-words transition-all",
              task.status === "complete"
                ? "text-gray-400 line-through"
                : "text-gray-800"
            )}
          >
            {task.title}
          </p>

          {/* 3. Hiển thị ngày giờ */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Tạo: {formatDate(task.createdAt)}</span>
            </div>

            {/* Chỉ hiện ngày hoàn thành nếu đã xong */}
            {task.status === "complete" && task.completedAt && (
              <div className="flex items-center gap-1 text-[#00cec9]">
                <span>• Xong: {formatDate(task.completedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Nút Xóa */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-300 hover:text-red-500 hover:bg-red-50 shrink-0"
          onClick={handleDelete}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
};

export default TaskCard;

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

// 1. Import component của Shadcn
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddTask = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");

  const handleAddTask = async () => {
    if (!title.trim()) return;

    try {
      await api.post("/tasks", { title });
      toast.success("Đã thêm nhiệm vụ mới!");
      setTitle("");
      onTaskAdded();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi khi thêm nhiệm vụ.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddTask();
  };

  return (
    <div className="flex w-full items-center space-x-2 mb-6">
      {/* 2. Dùng Input của Shadcn */}
      <Input
        type="text"
        placeholder="Hôm nay bạn cần làm gì?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className="h-12 text-base border-gray-200 focus-visible:ring-[#81ecec]"
      />

      {/* 3. Dùng Button của Shadcn */}
      {/* Ta chỉnh màu background thủ công để khớp với màu yêu cầu #81ecec */}
      <Button
        onClick={handleAddTask}
        className="h-12 bg-[#81ecec] hover:bg-[#00cec9] text-slate-900 font-bold px-6"
      >
        <Plus className="mr-2 h-5 w-5" /> Thêm
      </Button>
    </div>
  );
};

export default AddTask;

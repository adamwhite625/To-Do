import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Header } from "@/components/Header"; // Lưu ý đường dẫn có @
import AddTask from "@/components/AddTask";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import TaskListPagination from "@/components/TaskListPagination";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

const HomePage = () => {
  const [tasks, setTasks] = useState([]);

  // 1. Tạo biến lưu trạng thái bộ lọc (Mặc định là "all")
  const [filter, setFilter] = useState("all");

  // 2. Thêm state quản lý trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 3. State để hiển thị số lượng trên Badge
  const [counts, setCounts] = useState({ active: 0, completed: 0 });

  const fetchTasks = async () => {
    try {
      const response = await api.get(
        `/tasks?filter=${filter}&page=${page}&limit=4`
      );

      const { tasks, totalPages, activeCount, completeCount } = response.data;

      setTasks(tasks);
      setTotalPages(totalPages);
      setCounts({ active: activeCount, completed: completeCount });
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset về trang 1 khi đổi bộ lọc
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Cuộn nhẹ lên đầu danh sách
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f7fbfb] pb-20">
      <div className="container max-w-2xl mx-auto px-4">
        <Header />

        {/* Khi thêm mới, load lại trang 1 */}
        <AddTask
          onTaskAdded={() => {
            setPage(1);
            fetchTasks();
          }}
        />

        {/* --- KHU VỰC THỐNG KÊ & BỘ LỌC --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* Hiển thị số lượng (Lấy từ state counts) */}
          <div className="flex gap-3">
            <Badge
              variant="secondary"
              className="px-3 py-1 bg-blue-50 text-blue-600 border-blue-100 font-normal"
            >
              {counts.active} đang làm
            </Badge>

            <Badge
              variant="secondary"
              className="px-3 py-1 bg-green-50 text-green-600 border-green-100 font-normal"
            >
              {counts.completed} hoàn thành
            </Badge>
          </div>

          {/* Các nút lọc */}
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "Tất cả" },
              { id: "active", label: "Đang làm" },
              { id: "completed", label: "Hoàn thành" },
            ].map((type) => (
              <Button
                key={type.id}
                variant={filter === type.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handleFilterChange(type.id)}
                className={
                  filter === type.id
                    ? "bg-[#81ecec] hover:bg-[#00cec9] text-slate-900 shadow-sm"
                    : "text-gray-500 hover:bg-gray-100"
                }
              >
                <Filter className="w-4 h-4 mr-2" />
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* --- DANH SÁCH NHIỆM VỤ --- */}
        <div className="flex flex-col gap-2 min-h-[300px]">
          {tasks.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                Không tìm thấy nhiệm vụ nào.
              </p>
            </div>
          )}

          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onTaskChanged={fetchTasks} />
          ))}
        </div>

        {/* --- 5. THANH PHÂN TRANG (MỚI) --- */}
        <TaskListPagination
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default HomePage;

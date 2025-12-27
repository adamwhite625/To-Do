import Task from "../models/Task.js";

// Hàm tạo Task mới
//POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    // Tạo một task mới theo khuôn mẫu
    const task = new Task({ title });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi gọi createTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getAllTasks = async (req, res) => {
  // 1. Lấy bộ lọc từ URL (ví dụ: ?filter=week). Nếu không có thì mặc định là "today"
  const { filter = "today", page = 1, limit = 4 } = req.query;

  // Chuyển đổi sang số nguyên
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const now = new Date();
  let startDate;

  // 2. Logic xác định khoảng thời gian (Date Filter)
  // Logic này quyết định "Phạm vi dữ liệu" (VD: Chỉ lấy task của hôm nay)
  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "week": {
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
    default: {
      startDate = null; // null nghĩa là lấy tất cả thời gian
    }
  }

  // Tạo Query lọc theo ngày (Dùng chung cho cả đếm và lấy list)
  const dateQuery = startDate ? { createdAt: { $gte: startDate } } : {};

  // 3. Logic lọc theo trạng thái (Status Filter)
  // Chỉ áp dụng cho danh sách hiển thị (List), không áp dụng cho Badges thống kê
  let statusQuery = {};
  if (filter === "active") statusQuery = { status: "active" };
  if (filter === "completed") statusQuery = { status: "complete" };

  try {
    const result = await Task.aggregate([
      { $match: dateQuery }, // BƯỚC 1: Lọc theo ngày trước tiên
      {
        $facet: {
          // --- LUỒNG 1: Lấy danh sách nhiệm vụ (Có lọc status + Phân trang) ---
          tasks: [
            { $match: statusQuery }, // Lọc status (nếu user chọn active/completed)
            { $sort: { createdAt: -1 } }, // Sắp xếp mới nhất
            { $skip: skip }, // Bỏ qua
            { $limit: limitNumber }, // Lấy số lượng giới hạn
          ],

          // --- LUỒNG 2: Đếm tổng số task CỦA TRANG HIỆN TẠI (để tính totalPages) ---
          totalFiltered: [
            { $match: statusQuery }, // Phải match status giống Luồng 1
            { $count: "count" },
          ],

          // --- LUỒNG 3: Đếm Active (Giống code cũ - Để hiện Badge) ---
          // Đếm trên toàn bộ dateQuery, không bị ảnh hưởng bởi statusQuery
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],

          // --- LUỒNG 4: Đếm Complete (Giống code cũ - Để hiện Badge) ---
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    // Xử lý kết quả trả về
    const data = result[0];

    const tasks = data.tasks;
    const activeCount = data.activeCount[0]?.count || 0;
    const completeCount = data.completeCount[0]?.count || 0;

    // Tính tổng số trang dựa trên số lượng task sau khi đã lọc status
    const totalTasks = data.totalFiltered[0]?.count || 0;
    const totalPages = Math.ceil(totalTasks / limitNumber);

    // Trả về đầy đủ thông tin
    res.status(200).json({
      tasks,
      activeCount,
      completeCount,
      totalPages,
      currentPage: pageNumber,
      totalTasks,
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, // Lấy ID từ URL (ví dụ: /tasks/123 -> id là 123)
      {
        title,
        status,
        completedAt,
      },
      { new: true } // QUAN TRỌNG: Trả về dữ liệu MỚI sau khi sửa (mặc định Mongo trả cái cũ)
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi gọi updateTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    // Tìm và xóa luôn theo ID
    const deleteTask = await Task.findByIdAndDelete(req.params.id);

    if (!deleteTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    res.status(200).json(deleteTask);
  } catch (error) {
    console.error("Lỗi khi gọi deleteTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

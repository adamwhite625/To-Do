import Task from "../models/Task.js";

// Hàm tạo Task mới
//POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    // Tạo một task mới theo khuôn mẫu
    const task = new Task({ title });

    // 3. Lưu vào database (phải dùng await vì lưu vào kho mất thời gian)
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi gọi createTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getAllTasks = async (req, res) => {
  // 1. Lấy bộ lọc từ URL (ví dụ: ?filter=week). Nếu không có thì mặc định là "today"
  const { filter = "today" } = req.query;

  const now = new Date();
  let startDate; // Biến này sẽ chứa ngày bắt đầu cần lọc

  switch (filter) {
    case "today": {
      // Tạo ngày mới bắt đầu từ 00:00 sáng nay
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "week": {
      // Tính toán ngày thứ Hai đầu tuần
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": {
      // Lấy ngày mùng 1 của tháng hiện tại
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
    default: {
      startDate = null; // null nghĩa là lấy tất cả, không lọc ngày
    }
  }

  // Tạo câu lệnh tìm kiếm cho MongoDB: Nếu có startDate thì tìm cái nào LỚN HƠN ($gte) ngày đó
  const query = startDate ? { createdAt: { $gte: startDate } } : {};

  try {
    const result = await Task.aggregate([
      { $match: query }, // Bước 1: Lọc những task thỏa mãn ngày tháng trước
      {
        $facet: {
          // Bước 2: Phân chia kết quả thành 3 luồng dữ liệu riêng biệt
          // Luồng 1: Lấy danh sách task, sắp xếp mới nhất lên đầu (-1)
          tasks: [{ $sort: { createdAt: -1 } }],
          // Luồng 2: Lọc ra task đang làm (active) và đếm tổng số
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          // Luồng 3: Lọc ra task đã xong (complete) và đếm tổng số
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    // Kết quả trả về là một mảng, ta lấy phần tử đầu tiên
    const tasks = result[0].tasks;
    // Lấy số đếm ra, nếu không có dữ liệu thì mặc định là 0
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;

    res.status(200).json({ tasks, activeCount, completeCount });
    [cite_start]; // [cite: 26]
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

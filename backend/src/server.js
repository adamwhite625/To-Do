import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import taskRoute from "./routes/tasksRouters.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();

// --- PHẦN MIDDLEWARES (Bộ lọc trung gian) ---

// Quan trọng: Cho phép server đọc được dữ liệu JSON gửi lên
// Nếu thiếu dòng này, req.body trong Controller sẽ bị undefined (rỗng)
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use("/api/tasks", taskRoute);

// Đoạn này giúp Backend phục vụ luôn cả file Frontend khi đã build xong
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Kết nối Database trước. Nếu thành công thì mới cho Server chạy.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server bắt đầu chạy trên cổng ${PORT}`);
  });
});

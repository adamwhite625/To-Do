import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <Routes>
          {/* Tạm thời để trống Home, ta sẽ làm ở phần sau */}
          <Route
            path="/"
            element={
              <div className="text-center mt-20">Đang xây dựng HomePage...</div>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

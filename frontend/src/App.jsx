import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

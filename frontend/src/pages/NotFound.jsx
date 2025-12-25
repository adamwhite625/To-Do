import React from "react";
import { Ghost } from "lucide-react"; // Import icon ma cute

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background">
      <div className="p-6 rounded-full bg-primary/20 mb-6 animate-bounce">
        <Ghost className="w-20 h-20 text-teal-600" />
      </div>

      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Oops! Bạn đang đi lạc vào vùng đất hoang vắng.
      </p>

      <a
        href="/"
        className="px-8 py-3 font-medium bg-gradient-primary text-primary-foreground rounded-xl shadow-glow transition-transform hover:scale-105"
      >
        Quay về Trang chủ
      </a>
    </div>
  );
};

export default NotFound;

import React from "react";

export const Header = () => {
  return (
    <div className="text-center space-y-2 mb-8 pt-10">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#81ecec] to-[#00cec9]">
        Todo
      </h1>
      <p className="text-muted-foreground">
        Danh sách công việc hiện đại của bạn.
      </p>
    </div>
  );
};

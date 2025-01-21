"use client";

import React from "react";
import { Loader } from "lucide-react";

const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader className="size-6 animate-spin" />
    </div>
  );
};

export default ErrorPage;

import { redirectToLoginIfNoUser } from "@/features/auth/queries";
import React from "react";
import { TaskIdClient } from "./client";

const Page: React.FC = async () => {
  await redirectToLoginIfNoUser();

  return <TaskIdClient />;
};

export default Page;

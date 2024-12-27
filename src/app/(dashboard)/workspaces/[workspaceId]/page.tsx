import React from "react";
import { redirectToLoginIfNoUser } from "@/features/auth/actions";

const Page: React.FC = async () => {
  await redirectToLoginIfNoUser();

  return <div>Workspace Id </div>;
};

export default Page;

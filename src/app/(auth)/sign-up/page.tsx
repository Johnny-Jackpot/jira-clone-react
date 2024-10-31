import React from "react";
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";

const SignUpPage: React.FC = async () => {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return <SignUpCard />;
};

export default SignUpPage;

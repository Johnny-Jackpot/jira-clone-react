import React from "react";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { getCurrentUser } from "@/features/auth/actions";
import { redirect } from "next/navigation";

const SignInPage: React.FC = async () => {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return <SignInCard />;
};

export default SignInPage;

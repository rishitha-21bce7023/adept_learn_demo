"use client"; // Correct directive

import { redirect } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: ProtectedProps) {
  const { user } = useSelector((state: any) => state.auth);

  if (!user) {
    // Redirect if the user is not authenticated
    redirect("/login"); // Change this to your login or home page
    return null; // Return null after redirection
  }

  const isAdmin = user.role === "admin";

  if (!isAdmin) {
    // Redirect if the user is not an admin
    redirect("/"); // Redirect to home if the user is not an admin
    return null; // Return null after redirection
  }

  // If the user is authenticated and is an admin, render the children
  return <>{children}</>;
}

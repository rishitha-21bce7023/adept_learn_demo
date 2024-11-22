"use client";
import React from "react";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import EditCategories from "../../components/Admin/Customization/EditCategories"; // Ensure correct import path

type Props = {};

const Page: React.FC<Props> = (props) => { // Capitalized component name
  return (
    <div>
      <AdminProtected>
        <Heading
          title="AdeptLearn - Admin"
          description="Explore the world of AdeptLearn"
          keywords="Programming, MERN STACK, AI, ML"
        />
        <div className="flex h-[200vh]">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <EditCategories />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default Page; // Make sure it's exported correctly

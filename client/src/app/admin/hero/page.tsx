"use-client";
import React from "react";
import Heading from "../../utils/Heading";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import AdminProtected from "../../hooks/adminProtected";
import DashboardHero from "../../components/Admin/DashboardHero";
import EditHero from "../../components/Admin/Customization/EditHero";
type Props = {};

const page = (props: Props) => {
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
          <DashboardHero/>
          <EditHero/>
        </div>
      </div>
     </AdminProtected>
    </div>
  );
};

export default page;

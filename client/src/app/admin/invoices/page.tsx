'use client';

import React from 'react';
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import DashboardHeader from '@/app/components/Admin/DashboardHeader';
import AllInvoices from '@/app/components/Admin/Order/AllInvoices';
type Props = {};

const page: React.FC<Props> = (props) => {
  return (
    <div>
      <Heading
        title="AdeptLearn - Admin"
        description="Explore the world of AdeptLearn"
        keywords="Programming, MERN STACK, AI, ML"
      />
      <div className="flex">
        {/* Sidebar Section */}
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        
        {/* Main Content Section */}
        <div className="w-[85%]">
          <DashboardHeader />
          <AllInvoices />
        </div>
      </div>
    </div>
  );
};

export default page;

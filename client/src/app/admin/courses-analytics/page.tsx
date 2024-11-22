'use client';

import React from 'react';
import AdminSidebar from "@/app/components/Admin/sidebar/AdminSidebar";
import Heading from "@/app/utils/Heading";
import CourseAnalytics from "@/app/components/Admin/Analytics/CourseAnalytics";
import DashboardHeader from '@/app/components/Admin/DashboardHeader';

type Props = {};

const Page: React.FC<Props> = (props) => {
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
          <CourseAnalytics />
        </div>
      </div>
    </div>
  );
};

export default Page;

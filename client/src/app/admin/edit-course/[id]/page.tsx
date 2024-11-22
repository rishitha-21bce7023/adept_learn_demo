'use client';
import React from 'react';
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import Heading from "../../../../app/utils/Heading";
import CreateCourse from "../../../components/Admin/Course/CreateCourse";
import DashboardHeader from '@/app/components/Admin/DashboardHeader';
import EditCourse from "../../../components/Admin/Course/EditCourse";

type Props = {};

const Page = ({ params }: any) => {
    const id = params?.id;

    return (
        <div>
            <Heading
                title="AdeptLearn - Admin"
                description="Explore the world of AdeptLearn"
                keywords="Programming, MERN STACK, AI, ML"
            />
            <div className="flex">
                <div className="1500px:w-[16%] w-1/5">
                    <AdminSidebar />
                </div>
                <div className="w-[85%]">
                    <DashboardHeader />
                    {id ? (
                        <EditCourse id={id} />
                    ) : (
                        <CreateCourse /> 
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;

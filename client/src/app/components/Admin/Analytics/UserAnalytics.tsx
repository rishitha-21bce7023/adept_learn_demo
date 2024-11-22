// UserAnalytics.tsx
import { useGetUsersAnalyticsQuery } from '../../../../../redux/features/analytics/analyticsApi';
import React, { FC } from "react"; // Changed use to FC
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Loader from "../../Loader/Loader";
import { styles } from '@/app/styles/style';

type Props = {
    isDashboard?: boolean;
};

const UserAnalytics: FC<Props> = ({ isDashboard }) => { // Changed to FC<Props>
    const { data, isLoading } = useGetUsersAnalyticsQuery({});

    const analyticsData =
        data?.users?.last12Months?.map((item: any) => ({
            name: item.month,
            count: item.count,
        })) || [];

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={`${!isDashboard ? "mt-[50px]" : "mt-[50px] dark:bg-[#111C43] shadow-sm pb-5 rounded-sm"}`}>
                    <div className={`${isDashboard ? "!ml-18 mb-5" : ''}`}>
                        <h1 className={`${styles.title}${isDashboard && '!text-[20px]'} px-5 !text-start`}>
                            Users Analytics
                        </h1>
                        {!isDashboard && (
                            <p className={`${styles.label} ml-5`}>
                                Last 12 months analytics data{" "}
                            </p>
                        )}
                    </div>
                    <div className={`w-full ${isDashboard ? 'h-[30vh]' : 'h-screen'} flex items-center justify-center`}>
                        <ResponsiveContainer width={isDashboard ? '100%' : '90%'} height={!isDashboard ? "50%" : '100%'}>
                            <AreaChart
                                data={analyticsData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#4d62d9"
                                    fill="#4d62d9"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAnalytics;

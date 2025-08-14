import { Head, usePage } from "@inertiajs/react";
import { AdminDashboardPageData, DashboardPageData, DriverDashboardPageData, EmployeeDashboardPageData } from "../types/responsesTypes";
import { SharedData } from "../types";
import { useMemo } from "react";
import { UserType } from "../types/tablesModels";
import { UserRole } from "../types/enums";
import AdminDashboard from "./dashboard/admin/AdminDashboard";
import EmployeeDashboard from "./dashboard/employee/EmployeeDashboard";
import DriverDashboard from "./dashboard/driver/DriverDashboard";


function DashboardPage({data}: {
    data: DashboardPageData,
}) {
    const {auth} = usePage<SharedData>().props;
    
    console.log(data)
    
    const user: UserType = useMemo(() => auth.user, [auth]);

    if(!user) return <p>Unexpected error, unindentified user!</p>;

    return (
        <>
            <Head title="Dashboard" />
            {
                user.role === UserRole.admin ? 
                    <AdminDashboard user={user} data={data as AdminDashboardPageData} /> :
                user.role === UserRole.employee ?
                    <EmployeeDashboard user={user} data={data as EmployeeDashboardPageData} /> :
                user.role === UserRole.driver ?
                    <DriverDashboard user={user} data={data as DriverDashboardPageData} /> :
                    <p>Unknown user!</p>
            }
        </>
    )

}

export default DashboardPage
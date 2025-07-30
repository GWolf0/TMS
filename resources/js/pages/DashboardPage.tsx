import { SharedData } from '@/types'
import { UserRole } from '@/types/enums';
import { UserType } from '@/types/models';
import { usePage } from '@inertiajs/react'
import React, { useMemo } from 'react'
import AdminDashboard from './dashboard/AdminDashboard';
import { AdminDashboardPageData, DashboardPageData } from '@/types/pagesDataTypes';

function DashboardPage({data}: {
    data: DashboardPageData,
}) {
    const {auth} = usePage<SharedData>().props;
    console.log(data)
    const user: UserType = useMemo(() => auth.user, [auth]);

    // if(!user) return null;
    return <AdminDashboard user={user} data={data as AdminDashboardPageData} />
    // return user.role === UserRole.admin ? <AdminDashboard user={user} data={data as AdminDashboardPageData} /> : null;

}

export default DashboardPage
import React, { useMemo } from 'react'
import { z } from 'zod'
import { UserType } from '../../../types/tablesModels';
import { EmployeeDashboardPageData } from '../../../types/responsesTypes';
import DashBoardLayout from '../../../layouts/DashBoardLayout';
import { getDashboardSectionsByUserRole } from '../../../helpers/dashboardHelper';
import { EmployeeDashboardSection, DashboardSection, DashboardSectionDef } from '../../../types/dashboardTypes';
import { TableModel } from '../../../requests/requests';
import EmployeeDashboardReserveSection from './EmployeeDashboardReserveSection';
import EmployeeDashboardReservationsSection from './EmployeeDashboardReservationsSection';
import UserDashboardProfileSection from '../common/UserDashboardProfileSection';

// admin dashboard
function EmployeeDashboard({user, data}: {
    user: UserType, data: EmployeeDashboardPageData,
}) {
    const tmpCurSection = location.pathname.split("/")[2];
    const validSections: EmployeeDashboardSection[] = ["reserve", "reservations", "profile"];

    // redirect to default section if not specified or invalid
    if(!tmpCurSection || !validSections.includes(tmpCurSection as EmployeeDashboardSection)) {
        location.pathname = `/dashboard/${validSections[0]}`;
        return null;
    }

    const curSectionName: EmployeeDashboardSection = tmpCurSection as EmployeeDashboardSection;
    const sections: DashboardSectionDef[] = useMemo(() => getDashboardSectionsByUserRole(user.role), [user]);

    function getContent(): React.ReactNode {
        switch(curSectionName) {
            case "reserve":
                return <EmployeeDashboardReserveSection data={data} />;
            case "reservations":
                return <EmployeeDashboardReservationsSection data={data} />;
            case "profile":
                return <UserDashboardProfileSection user={user} profileData={data.profile} />;
            default:
                return <p>Unknown dashboard section!</p>
        }
    }

    return (
        <DashBoardLayout
            user={user}
            sections={sections}
        >

            { getContent() }

        </DashBoardLayout>
    )

}

export default EmployeeDashboard;

import React, { useMemo } from 'react'
import { z } from 'zod'
import { UserType } from '../../../types/tablesModels';
import { DriverDashboardPageData } from '../../../types/responsesTypes';
import DashBoardLayout from '../../../layouts/DashBoardLayout';
import { getDashboardSectionsByUserRole } from '../../../helpers/dashboardHelper';
import { DriverDashboardSection, DashboardSection, DashboardSectionDef } from '../../../types/dashboardTypes';
import { TableModel } from '../../../requests/requests';
import DriverDashboardShiftsSection from './DriverDashboardShiftsSection';
import UserDashboardProfileSection from '../common/UserDashboardProfileSection';

// admin dashboard
function DriverDashboard({user, data}: {
    user: UserType, data: DriverDashboardPageData,
}) {
    const tmpCurSection = location.pathname.split("/")[2];
    const validSections: DriverDashboardSection[] = ["shifts", "profile"];

    // redirect to default section if not specified or invalid
    if(!tmpCurSection || !validSections.includes(tmpCurSection as DriverDashboardSection)) {
        location.pathname = `/dashboard/${validSections[0]}`;
        return null;
    }

    const curSectionName: DriverDashboardSection = tmpCurSection as DriverDashboardSection;
    const sections: DashboardSectionDef[] = useMemo(() => getDashboardSectionsByUserRole(user.role), [user]);

    function getContent(): React.ReactNode {
        switch(curSectionName) {
            case "shifts":
                return <DriverDashboardShiftsSection data={data} />;
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

export default DriverDashboard;

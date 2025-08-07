import React, { useMemo } from 'react'
import { z } from 'zod'
import { UserType } from '../../../types/tablesModels';
import { AdminDashboardPageData } from '../../../types/responsesTypes';
import DashBoardLayout from '../../../layouts/DashBoardLayout';
import { getDashboardSectionsByUserRole } from '../../../helpers/dashboardHelper';
import { AdminDashboardSection, DashboardSection, DashboardSectionDef } from '../../../types/dashboardTypes';
import { TableModel } from '../../../requests/requests';
import AdminDashboardTMSSystemSection from './AdminDashboardTMSSystemSection';
import AdminDashboardCRUDModelSection from './AdminDashboardCRUDModelSection';
import UserDashboardProfileSection from '../common/UserDashboardProfileSection';

// admin dashboard
function AdminDashboard({user, data}: {
    user: UserType, data: AdminDashboardPageData,
}) {
    const tmpCurSection = location.pathname.split("/")[2];
    const validSections: AdminDashboardSection[] = ["users", "tms_system", "organizations", "trajects", "vehicles", "reservations", "shifts", "conflicts", "profile"];

    // redirect to default section if not specified or invalid
    if(!tmpCurSection || !validSections.includes(tmpCurSection as AdminDashboardSection)) {
        location.pathname = `/dashboard/${validSections[0]}`;
        return null;
    }

    const curSectionName: AdminDashboardSection = tmpCurSection as AdminDashboardSection;
    const crudModel = getCRUDModelBySectionName(curSectionName);
    const sections: DashboardSectionDef[] = useMemo(() => getDashboardSectionsByUserRole(user.role), [user]);

    function getCRUDModelBySectionName(sectionName: AdminDashboardSection): TableModel | undefined {
        switch(sectionName) {
            case "users": return TableModel.user;
            case "tms_system": return TableModel.tms_system;
            case "organizations": return TableModel.organization;
            case "trajects": return TableModel.traject;
            case "vehicles": return TableModel.vehicle;
            case "reservations": return TableModel.reservation;
            case "shifts": return TableModel.shift;
            case "conflicts": return TableModel.conflict;
            default: return undefined;
        }
    }

    function getContent(): React.ReactNode {
        if(validSections.includes(curSectionName)) {
            if(curSectionName === "tms_system") {
                return (
                    <AdminDashboardTMSSystemSection data={data} />
                )
            } else if(curSectionName === "profile") {
                return <UserDashboardProfileSection user={user} profileData={data.profile} />;
            } else { // other crud models
                return crudModel ? (
                    <AdminDashboardCRUDModelSection 
                        data={data}
                        model={crudModel!}
                    />
                ) : 
                (<p>Invalid crud model!</p>)
            }
        } else {
            return <p>Unknown section</p>
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

export default AdminDashboard;

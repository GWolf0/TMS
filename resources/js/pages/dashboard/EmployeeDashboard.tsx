import SearchComp from '@/components/common/SearchComp'
import DWProfileInfoWidget from '@/components/dashboard/customWidgets/common/DWProfileInfoWidget'
import DWEmployeeReservationsWidget from '@/components/dashboard/customWidgets/employee/DWEmployeeReservationsWidget'
import DWEmployeeReserveWidget from '@/components/dashboard/customWidgets/employee/DWEmployeeReserveWidget'
import { getFormItemsFromModelName, getSearchableFieldsFromModelName } from '@/helpers/dataHelper'
import { strCapitalize, strPluralize, strStripUnderscores } from '@/helpers/strHelper'
import DashBoardLayout from '@/layouts/DashBoardLayout'
import { ModelsNames, Models } from '@/requests/requests'
import { DashboardDef, DashboardWidgetDef, DWCustomOptions, DWDataTableOptions, DWSingleRecordEditorOptions } from '@/types/dashboard'
import { UserType } from '@/types/models'
import { AdminDashboardPageData, EmployeeDashboardPageData } from '@/types/pagesDataTypes'
import { FormItemDef } from '@/types/ui'
import React, { useMemo } from 'react'
import { z } from 'zod'

// admin dashboard
function EmployeeDashboard({user, data}: {
    user: UserType, data: EmployeeDashboardPageData,
}) {
    const dashboard: DashboardDef = useMemo(() => EMPLOYEE_DASHBOARD_DEFINITION(data), [data]);

    return (
        <DashBoardLayout
            user={user}
            sections={dashboard.sections}
        />
    )

}

export default EmployeeDashboard;

// dashboard definition
const EMPLOYEE_DASHBOARD_DEFINITION = (data: EmployeeDashboardPageData): DashboardDef => ({
    name: "Employee Dashboard",
    sections: [
        {
            name: "Reserve", 
            pathName: `/dashboard/reserve`,
            widgets: [
                {
                    type: "custom",
                    options: {
                        component: <DWEmployeeReserveWidget todaysReservations={data.todaysReservations} />
                    } as DWCustomOptions,
                },
            ] as DashboardWidgetDef[],
        },
        {
            name: "Reservations", 
            pathName: `/dashboard/reservations`,
            widgets: [
                {
                    type: "custom",
                    options: {
                        component: <DWEmployeeReservationsWidget paginatedReservations={data.paginatedReservations}  />
                    } as DWCustomOptions,
                },
            ] as DashboardWidgetDef[],
        },
        {
            name: "Profile", 
            pathName: `/dashboard/profile`,
            widgets: [
                {
                    type: "custom",
                    options: {
                        component: <DWProfileInfoWidget profile={data.profile} />
                    } as DWCustomOptions,
                },
            ] as DashboardWidgetDef[],
        },
    ]
});

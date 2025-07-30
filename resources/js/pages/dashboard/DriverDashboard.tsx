import SearchComp from '@/components/common/SearchComp'
import DWProfileInfoWidget from '@/components/dashboard/customWidgets/common/DWProfileInfoWidget'
import DWDriverShiftsWidget from '@/components/dashboard/customWidgets/driver/DWDriverShiftsWidget'
import { getFormItemsFromModelName, getSearchableFieldsFromModelName } from '@/helpers/dataHelper'
import { strCapitalize, strPluralize, strStripUnderscores } from '@/helpers/strHelper'
import DashBoardLayout from '@/layouts/DashBoardLayout'
import { ModelsNames, Models } from '@/requests/requests'
import { DashboardDef, DashboardWidgetDef, DWCustomOptions, DWDataTableOptions, DWSingleRecordEditorOptions } from '@/types/dashboard'
import { UserType } from '@/types/models'
import { AdminDashboardPageData, DriverDashboardPageData } from '@/types/pagesDataTypes'
import { FormItemDef } from '@/types/ui'
import React, { useMemo } from 'react'
import { z } from 'zod'

// admin dashboard
function DriverDashboard({user, data}: {
    user: UserType, data: DriverDashboardPageData,
}) {
    const dashboard: DashboardDef = useMemo(() => EMPLOYEE_DASHBOARD_DEFINITION(data), [data]);

    return (
        <DashBoardLayout
            user={user}
            sections={dashboard.sections}
        />
    )

}

export default DriverDashboard;

// dashboard definition
const EMPLOYEE_DASHBOARD_DEFINITION = (data: DriverDashboardPageData): DashboardDef => ({
    name: "Driver Dashboard",
    sections: [
        {
            name: "Shifts", 
            pathName: `/dashboard/shifts`,
            widgets: [
                {
                    type: "custom",
                    options: {
                        component: <DWDriverShiftsWidget assignedShifts={data.assignedShifts} authorizations={data.authorizations} 
                            availability={data.availability} 
                        />
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

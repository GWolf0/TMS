import SearchComp from '@/components/common/SearchComp'
import DWProfileInfoWidget from '@/components/dashboard/customWidgets/common/DWProfileInfoWidget'
import { getFormItemsFromModelName, getSearchableFieldsFromModelName } from '@/helpers/dataHelper'
import { strCapitalize, strPluralize, strStripUnderscores } from '@/helpers/strHelper'
import { getFormItemsFromZod, getZodFromModelName } from '@/helpers/zodHelper'
import DashBoardLayout from '@/layouts/DashBoardLayout'
import { ModelsNames, Models } from '@/requests/requests'
import { DashboardDef, DashboardWidgetDef, DWCustomOptions, DWDataTableOptions, DWSingleRecordEditorOptions } from '@/types/dashboard'
import { UserType } from '@/types/models'
import { AdminDashboardPageData } from '@/types/pagesDataTypes'
import { FormItemDef } from '@/types/ui'
import React, { useMemo } from 'react'
import { z } from 'zod'

// admin dashboard
function AdminDashboard({user, data}: {
    user: UserType, data: AdminDashboardPageData,
}) {
    const dashboard: DashboardDef = useMemo(() => ADMIN_DASHBOARD_DEFINITION(data), [data]);

    return (
        <DashBoardLayout
            user={user}
            sections={dashboard.sections}
        />
    )

}

export default AdminDashboard;

// dashboard definition
const ADMIN_DASHBOARD_DEFINITION = (data: AdminDashboardPageData): DashboardDef => ({
    name: "Admin Dashboard",
    sections: [
        // similar crud models sections (return by function, Models should be registered in requests.ts)
        ...Object.keys(Models).filter(m => m !== "tms_system").map((modelName, i) => (
            {
                name: strCapitalize(strStripUnderscores(modelName)), 
                pathName: `/dashboard/${strPluralize(modelName)}`,
                widgets: [
                    // search widget (common)
                    {
                        type: "custom",
                        options: {
                            component: (
                                <SearchComp
                                    formItems={
                                        getFormItemsFromModelName(modelName as ModelsNames).filter(
                                            f => getSearchableFieldsFromModelName(modelName as ModelsNames).includes(f.name)
                                        )
                                    }
                                    mainSearchItemIdx={0}
                                />
                            ),
                        } as DWCustomOptions,
                    },
                    // data table (enables crud, generate based on model name)
                    {
                        type: "data_table",
                        options: {
                            title: "",
                            fields: getFormItemsFromZod(getZodFromModelName(modelName as ModelsNames)),
                            data: data.paginatedData,
                            withEdit: true,
                            withDelete: true,
                            modelName: modelName
                        } as DWDataTableOptions,
                    }
                ] as DashboardWidgetDef[],
            }
        )),
        // other sections (single entry models)
        {
            name: "TMS System", 
            pathName: `/dashboard/tmssystem`,
            widgets: [
                // single record editor
                {
                    type: "single_record_editor",
                    options: {
                        title: "",
                        modelName: "tms_system",
                        fields: getFormItemsFromZod(getZodFromModelName("tms_system")),
                        data: data.data,
                    } as DWSingleRecordEditorOptions,
                }
            ] as DashboardWidgetDef[],
        },
        // Profile
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

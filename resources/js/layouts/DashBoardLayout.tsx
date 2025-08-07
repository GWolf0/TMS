import React from 'react'
import MainLayout from './MainLayout'
import { UserType } from '../types/tablesModels';
import TabsButtons from '../components/common/TabsButtons';
import { DashboardSection, DashboardSectionDef } from '../types/dashboardTypes';

function DashBoardLayout({user, sections, children}: {
    user: UserType, sections: DashboardSectionDef[], children: React.ReactNode,
}) {

    return (
        <MainLayout>

            {/* // sections tabs */}
            <TabsButtons 
                tabs={sections.map((s, i) => ({ name: s.name, displayName: s.displayName, pathName: `/dashboard/${s.name}` }))}
            />

            {/* // widgets */}
            <div className='flex flex-col gap-4 mt-8'>

                { children }

            </div>

        </MainLayout>
    )

}

export default DashBoardLayout
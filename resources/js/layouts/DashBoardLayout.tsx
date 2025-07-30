import React from 'react'
import MainLayout from './MainLayout'
import { DashboardSectionDef } from '@/types/dashboard'
import TabsButtons from '@/components/common/TabsButtons'
import DashboardWidget from '@/components/dashboard/widgets/DashboardWidget'
import { UserType } from '@/types/models'

function DashBoardLayout({sections, user}: {
    sections: DashboardSectionDef[], user: UserType,
}) {
    const curSectionIdx: number = Math.max(0, sections.findIndex(s => s.pathName === location.pathname));

    return (
        <MainLayout>

            {/* // sections tabs */}
            <TabsButtons 
                tabs={sections.map((s, i) => ({ name: s.name, displayName: s.name.replaceAll("_", " ").toUpperCase(), pathName: s.pathName }))}
            />

            {/* // widgets */}
            <div className='flex flex-col gap-4 mt-8'>

                {
                    sections[curSectionIdx].widgets.map((w, i) => <DashboardWidget key={i} widget={w} />)
                }

            </div>

        </MainLayout>
    )

}

export default DashBoardLayout
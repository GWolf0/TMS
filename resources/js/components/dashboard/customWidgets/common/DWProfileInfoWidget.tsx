import InfoComp from '@/components/common/InfoComp'
import { JSONType } from '@/types/common'
import { USER_FORM_ITEMS, UserType } from '@/types/models'
import React from 'react'

function DWProfileInfoWidget({profile}: {
    profile?: JSONType
}) {
    if(!profile) return "null";

    // Rendering functions
    // render profile info
    function renderProfileInfoSection(): React.ReactNode{
        if(!profile) return;
        
        return (
            <InfoComp
                title={`Profile Info`}
                items={USER_FORM_ITEMS.filter((it) => Object.keys(profile).includes(it.name))}
                data={profile}
            />
        )
    }

    return (
        <main>

            {/* // profile info section */}
            { renderProfileInfoSection() }

        </main>
    )

}

export default DWProfileInfoWidget
import React from 'react'
import { JSONType } from '../../../types/common'
import { UserType } from '../../../types/tablesModels'
import { FormItemDef } from '../../../types/uiTypes'
import { getTableModelDef, TableModelDef } from '../../../helpers/tablesModelsHelper'
import { TableModel } from '../../../requests/requests'
import InfoComp from '../../../components/common/InfoComp'

function UserDashboardProfileSection({user, profileData}: {
    user: UserType, profileData: JSONType | undefined,
}) {
    if(!profileData) return <p>Error: Invalid page response!</p>

    const userModelDef: TableModelDef = getTableModelDef(TableModel.user);

    // render fns
    // render user profile data
    function renderProfileDataInfo(): React.ReactNode {
        return (
            <InfoComp 
                title={`User Profile`}
                items={userModelDef.formItems}
                data={profileData!}
                substituteFKsWithLabels
                substituteColumns={{"created at": "joined on"}}
            />
        )
    }

    return (
        <>
            { renderProfileDataInfo() }
        </>
    )

}

export default UserDashboardProfileSection
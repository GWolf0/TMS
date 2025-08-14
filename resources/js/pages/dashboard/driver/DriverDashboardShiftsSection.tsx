import React from 'react'
import { DriverDashboardPageData } from '../../../types/responsesTypes'
import { DOE, HTTPRequest, JSONType, PaginatedData } from '../../../types/common';
import { dataToPaginatedData } from '../../../helpers/dataHelper';
import DataTable from '../../../components/CRUD/DataTable';
import FormComp from '../../../components/common/formComp/FormComp';
import { DRIVER_UPDATE_AVAILABILITY_REQ } from '../../../requests/requests';
import { sendRequest } from '../../../helpers/requestHelper';
import AlertService from '../../../services/AlertService';
import { z } from 'zod';

function DriverDashboardShiftsSection({data}: {
    data: DriverDashboardPageData,
}) {
    const assignedShifts: JSONType[] | undefined = data.assignedShifts;
    if(!assignedShifts) return <p>Error: Invalid page response!</p>

    const assignedShiftsPData: PaginatedData<JSONType> = dataToPaginatedData(assignedShifts);

    // actions fns
    async function onEditAvailability(json: JSONType): Promise<DOE> {
        const request: HTTPRequest = DRIVER_UPDATE_AVAILABILITY_REQ;

        const doe: DOE = await sendRequest(request, json);

        if(doe.error) {
            AlertService.showAlert({id: 0, text: doe.error.message ?? "Error updating availability!", severity: "error"});
        } else {
            AlertService.showAlert({id: 0, text: "Availability updated!"});
        }

        return doe;
    }

    // render fns
    function renderAssignedShiftsDataTable(): React.ReactNode {
        return (
            <DataTable 
                title='Assigned Shifts'
                pdata={assignedShiftsPData}
                actions={[]}
                substituteFKsWithLabels
                hiddenKeys={["id", "updated_at", "labels"]}
            />
        )
    }

    function renderEditAvailabilityForm(): React.ReactNode {
        return (
            <FormComp 
                formDef={{
                    id: `driver_availabilty_edit`,
                    title: `Edit availability`,
                    items: [
                        {name: "is_available", displayName: "I am available", type: "boolean"},
                    ],
                    action: {name: "edit", displayName: "Edit", 
                        onValidatedData: onEditAvailability, 
                        authorization: data.authorizations?.update_availability,
                        validation: z.object({is_available: z.boolean({coerce: true})})
                    }
                }}
                data={{is_available: data.availability}}
            />
        )
    }

    return (
        <>
            { renderAssignedShiftsDataTable() }

            <hr />

            { renderEditAvailabilityForm() }
        </>
    )

}

export default DriverDashboardShiftsSection
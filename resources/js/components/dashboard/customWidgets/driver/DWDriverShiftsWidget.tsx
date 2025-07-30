import DataTable from '@/components/common/DataTable'
import FormComp from '@/components/common/FormComp';
import { dataToPaginatedData } from '@/helpers/dataHelper'
import { sendRequest } from '@/helpers/requestHelper';
import { DRIVER_UPDATE_AVAILABILITY_REQ } from '@/requests/requests';
import AlertService from '@/services/AlertService';
import { DOE, JSONType, PaginatedData } from '@/types/common'
import React, { useMemo } from 'react'

// Not only showing current shifts assigned to driver, but also ability to update availability state
function DWDriverShiftsWidget({assignedShifts, authorizations, availability}: {
    assignedShifts?: JSONType[],
    authorizations?: { 
        update_availability: boolean,
    },
    availability?: boolean,
}) {
    if(!assignedShifts || !authorizations || !availability) return "nukk";

    const pdata: PaginatedData = useMemo(() => dataToPaginatedData(assignedShifts), [assignedShifts]);

    // Actions
    // on update availability
    async function onUpdateAvailability(validatedData: JSONType): Promise<DOE> {
        const doe: DOE = await sendRequest(DRIVER_UPDATE_AVAILABILITY_REQ, validatedData);

        if(doe.error){
            AlertService.showAlert({id: -1, text: `Error updating availability!`, severity: "error"});
        }else{
            AlertService.showAlert({id: -1, text: `Availability updated successfuly!`});
        }

        return doe;
    }

    // Rendering functions
    // render assigned shifts table
    function renderAssignedShiftsTable(): React.ReactNode{
        return (
            <DataTable
                pdata={pdata}
                actions={[]}
            />
        )
    }

    // render update availability form
    function renderUpdateAvailabilityForm(): React.ReactNode{
        return (
            <FormComp 
                formDef={{
                    id: `update_availablity`,
                    title: "Update Availability",
                    items: [
                        {name: "availability", type: "boolean"},
                    ],
                    action:{
                        name: "update_availability",
                        displayName: "Update Availability",
                        authorized: authorizations?.update_availability,
                        onValidatedData: onUpdateAvailability,
                    }
                }}
                data={{availability}}
            />
        )
    }

    return (
        <main>

            {/* // assigned shifts table */}
            <section>
                { renderAssignedShiftsTable() }
            </section>

            {/* // update availability form */}
            <section>
                { renderUpdateAvailabilityForm() }
            </section>

        </main>
    )

}

export default DWDriverShiftsWidget
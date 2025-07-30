import DataTable, { DataTableActionDef } from '@/components/common/DataTable'
import { PaginatedData, JSONType } from '@/types/common'
import React from 'react'

function DWEmployeeReservationsWidget({paginatedReservations}: {
    paginatedReservations?: PaginatedData<JSONType>,
}) {
    if(!paginatedReservations) return "null";

    // actions
    async function onInfoDataTableAction(rowIdx: number, data: JSONType) {
        
    }

    // rendering functions
    // get table actions
    function getDataTableActions(): DataTableActionDef[]{
        return [
            {
                name: "Info",
                icon: "bi-more",
                callback: onInfoDataTableAction,
            }
        ];
    }

    // render reservations table
    function renderReservationsTable(): React.ReactNode{
        if(!paginatedReservations) return;
        
        return (
            <DataTable 
                pdata={paginatedReservations}
                actions={getDataTableActions()}
            />
        )
    }

    return (
        <main>

            { renderReservationsTable() }

        </main>
    )

}

export default DWEmployeeReservationsWidget
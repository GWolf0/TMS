import React from 'react'
import { EmployeeDashboardPageData } from '../../../types/responsesTypes'
import DataTable from '../../../components/CRUD/DataTable'
import { JSONType, PaginatedData } from '../../../types/common';
import { dataToPaginatedData } from '../../../helpers/dataHelper';
import { FormItemDef } from '../../../types/uiTypes';
import { getTableModelDef, TableModelDef } from '../../../helpers/tablesModelsHelper';
import { TableModel } from '../../../requests/requests';

function EmployeeDashboardReservationsSection({data}: {
    data: EmployeeDashboardPageData,
}) {
    const pdataRaw: PaginatedData<JSONType> | undefined = data.paginatedReservations;
    if(!pdataRaw) return <p>Error: Invalid page response!</p>

    const pdata: PaginatedData<JSONType> = dataToPaginatedData(pdataRaw);

    // render fns
    // render data table
    function renderReservationsDataTable(): React.ReactNode {
        const modelDef: TableModelDef = getTableModelDef(TableModel.reservation);
        const items: FormItemDef[] = modelDef.formItems;

        return (
            <DataTable 
                title='Reservations'
                pdata={pdata}
                formItems={items}
                hiddenKeys={["id", "updated_at", "labels", "traject", "user", "shift"]}
                substituteFKsWithLabels
                substituteColumns={{"created_at": "created"}}
                actions={[]}
            />
        )
    }

    return (
        <>
            { renderReservationsDataTable() }
        </>
    )

}

export default EmployeeDashboardReservationsSection
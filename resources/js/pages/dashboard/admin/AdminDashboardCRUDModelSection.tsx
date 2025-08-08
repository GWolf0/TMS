import React, { useMemo, useState } from 'react'
import SearchComp from '../../../components/common/SearchComp'
import { FormItemDef } from '../../../types/uiTypes'
import { AdminDashboardPageData } from '../../../types/responsesTypes';
import DataTable, { DataTableActionDef, DataTableTopActionDef } from '../../../components/CRUD/DataTable';
import { JSONType, PaginatedData } from '../../../types/common';
import { UserRole } from '../../../types/enums';
import useRequest from '../../../hooks/useRequest';
import { GetCRUDREQUEST, TableModel, TableModelName } from '../../../requests/requests';
import { mfetch, sendRequest } from '../../../helpers/requestHelper';
import ModalService from '../../../services/ModalService';
import SingleRecordEditorModal, { SINGLE_RECORD_EDITOR_MODAL_ID } from '../../../components/customModals/SingleRecordEditorModal';
import AlertService from '../../../services/AlertService';
import { getTableModelDef, TableModelDef } from '../../../helpers/tablesModelsHelper';
import { strCapitalize } from '../../../helpers/stringHelper';
import { dataToPaginatedData } from '../../../helpers/dataHelper';
import { Button } from '../../../components/ui/button';

function AdminDashboardCRUDModelSection({data, model}: {
    data: AdminDashboardPageData, model: TableModel,
}) {
    // data
    const modelDef: TableModelDef = useMemo(() => getTableModelDef(model), [model]);
    // const pdata: PaginatedData<JSONType> = useMemo(() => dataToPaginatedData(data.paginatedData), [data]);
    const [pdata, setPData] = useState< PaginatedData<JSONType>>(dataToPaginatedData(data.paginatedData));
    const searchItems: FormItemDef[] = useMemo(() => modelDef.formItems.filter(fi => modelDef.searchFields.includes(fi.name)), [modelDef]);

    // states
    const [actionBlocked, setActionBlocked] = useState<boolean>(false); // block certain async actions

    // actions fns
    function onNewRecord() {
        ModalService.showCustomModal({
            id: SINGLE_RECORD_EDITOR_MODAL_ID,
            component: <SingleRecordEditorModal 
                model={modelDef.model}
                modelName={modelDef.name}
                mode={"create"}
                data={undefined}
                onSuccess={onSuccess}
            />
        });
    }

    async function onEditActionBtn(rowIdx: number, data: JSONType) {
        ModalService.showCustomModal({
            id: SINGLE_RECORD_EDITOR_MODAL_ID,
            component: <SingleRecordEditorModal 
                model={modelDef.model}
                modelName={modelDef.name}
                mode={"update"}
                data={data}
                onSuccess={onSuccess}
            />
        });
    }

    function onSuccess(record: JSONType, mode: "create"|"update") {
        if(mode === "create") { // prepend recently created record
            setPData(prev => ({...prev, data: [{...record}, ...prev.data]}));
        }else { // update updated record
            setPData(prev => ({...prev, data: prev.data.map((d => {
                if(d["id"] === record["id"]) {
                    return {...record};
                }
                return d;
            }))}));
        }

        ModalService.closeCustomModal(SINGLE_RECORD_EDITOR_MODAL_ID);
    }

    async function onDeleteActionBtn(rowIdx: number, data: JSONType) {
        if(actionBlocked || !confirm(`Confirm delete record?`)) return;

        setActionBlocked(true);
        const doe = await sendRequest(GetCRUDREQUEST("user", "destroy"), {id: data["id"]});
        
        if(doe.error) {
            AlertService.showAlert({id: 0, text: `Error deleting record!`, severity: "error"});
        }else {
            AlertService.showAlert({id: 0, text: `Record deleted successfuly!`});
        }
        
        setActionBlocked(false);

        return true;
    }

    // render fns
    // render search component
    function renderSearchComp(): React.ReactNode {
        return (
            <SearchComp 
                formItems={searchItems}
                mainSearchItemIdx={0}
            />
        )
    }

    // render data table
    function renderDataTable(): React.ReactNode {
        return (
            <DataTable 
                title={`${strCapitalize(modelDef.model)} List`}
                pdata={pdata}
                actions={getDataTableActions()}
                topActions={getDataTableTopActions()}
                substituteFKsWithLabels={true}
                hiddenKeys={[...modelDef.fields.filter(fname => !modelDef.createFields.includes(fname)), "labels"]}
                formItems={modelDef.formItems}
            />
        )
    }

    // get data table actions
    function getDataTableActions(): DataTableActionDef[] {
        return [
            {name: "edit", callback: onEditActionBtn, icon: "bi bi-pen-fill"},
            {name: "delete", callback: onDeleteActionBtn, icon: "bi bi-trash"},
        ];
    }

    // get data table top actions
    function getDataTableTopActions(): DataTableTopActionDef[] {
        return [
            {name: "New", icon: "bi bi-plus-lg", callback: onNewRecord},
        ];
    }

    // async function onTest() {
    //     // const doe = await mfetch({url: "/crud/users/{4}", method: "PATCH"});
    //     const doe = await sendRequest({url: "/crud/users/{id}", method: "PATCH"}, {id: 4});
    //     console.log(doe)
    // }

    return (
        <>
            {/* <Button onClick={onTest}>Test</Button> */}
            { renderSearchComp() }
            { renderDataTable() }
        </>
    )

}

export default AdminDashboardCRUDModelSection
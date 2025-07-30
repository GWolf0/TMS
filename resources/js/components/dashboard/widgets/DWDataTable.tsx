import DataTable, { DataTableActionDef } from '@/components/common/DataTable';
import SingleRecordEditorModal, { SINGLE_RECORD_EDITOR_MODAL_ID } from '@/components/modals/SingleRecordEditorModal';
import { Button } from '@/components/ui/button';
import { dataToPaginatedData } from '@/helpers/dataHelper';
import { sendRequest } from '@/helpers/requestHelper';
import { GetCRUDREQUEST } from '@/requests/requests';
import AlertService from '@/services/AlertService';
import ModalService from '@/services/ModalService';
import { DOE, HTTPRequest, JSONType, PaginatedData } from '@/types/common';
import { DashboardWidgetDef, DWDataTableOptions } from '@/types/dashboard'
import React, { useCallback, useMemo, useState } from 'react'

// display a data table widget
function DWDataTable({widget}: {
    widget: DashboardWidgetDef,
}) {
    const options: DWDataTableOptions = useMemo(() => widget.options as DWDataTableOptions, [widget]);
    // const pdata: PaginatedData<JSONType> = useMemo(() => dataToPaginatedData<JSONType>(options.data), [options]);
    const [pdata, setPData] = useState<PaginatedData<JSONType>>(dataToPaginatedData<JSONType>(options.data));
    
    // get Actions
    const getActions = useCallback((): DataTableActionDef[] => {
        let actions = [];
        if(options.withEdit) actions.push({ name: "Edit", callback: onTriggerEditRecord, icon: "bi bi-pen" });
        if(options.withDelete) actions.push({ name: "Delete", callback: onTriggerDeleteRecord, icon: "bi bi-trash" });
        return actions;
    }, []);

    // actions callbacks
    // edit
    async function onTriggerEditRecord(rowIdx: number, data: JSONType){console.log("data", data)
        // open single record editor modal
        ModalService.showCustomModal(
            {
                id: SINGLE_RECORD_EDITOR_MODAL_ID,
                component: (
                    <SingleRecordEditorModal 
                        mode='edit'
                        record={data}
                        modelName={options.modelName}
                    />
                )
            }
        );
    }

    // create new record modal
    function onNewBtn(){
        ModalService.showCustomModal(
            {
                id: SINGLE_RECORD_EDITOR_MODAL_ID,
                component: (
                    <SingleRecordEditorModal 
                        mode='create'
                        record={undefined}
                        modelName={options.modelName}
                    />
                )
            }
        );
    }

    // delete
    async function onTriggerDeleteRecord(rowIdx: number, data: JSONType){
        ModalService.showConfirm(`Confirm delete`, async (value: boolean) => {
            if(value){
                const request: HTTPRequest = GetCRUDREQUEST(options.modelName, "destroy");
                if(!request) return;
        
                const doe: DOE = await sendRequest(request, {id: data["id"]});
                if(doe.error){
                    AlertService.showAlert({id: -1, text: doe.error.message ?? "Error deleting record!", severity: "error"});
                    setPData(prev => ({ ...prev, data: prev.data.filter((r, i) => i !== rowIdx) }));
                }else{
                    AlertService.showAlert({id: -1, text: "Record deleted successfuly!"});
                }
            }
        });
    }

    return (
        <section className='flex flex-col gap-2'>

            <div className='flex items-center py-2'>
                <Button onClick={onNewBtn}><i className='bi bi-plus-lg'></i> New</Button>
            </div>

            <DataTable 
                title={options.title}
                pdata={pdata}
                actions={getActions()}
            />

        </section>
    )

}

export default DWDataTable
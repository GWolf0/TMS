import FormComp from '@/components/common/FormComp';
import { sendRequest } from '@/helpers/requestHelper';
import { pickFromZod } from '@/helpers/zodHelper';
import useFetch from '@/hooks/useFetch';
import { GetCRUDREQUEST } from '@/requests/requests';
import AlertService from '@/services/AlertService';
import { DOE, JSONType } from '@/types/common';
import { DashboardWidgetDef, DWSingleRecordEditorOptions } from '@/types/dashboard'
import { FormAction, FormItemDef } from '@/types/ui';
import React, { useCallback, useMemo } from 'react'

const FIELDS_TO_EXCLUDE = ["created_at", "updated_at", "email_verified_at", "labels"];
// returns a form to edit/create a record
function DWSingleRecordEditor({widget}: {
    widget: DashboardWidgetDef,
}){
    const options: DWSingleRecordEditorOptions = useMemo(() => widget.options as DWSingleRecordEditorOptions, [widget]);
    const fields: FormItemDef[] = useMemo(() => options.fields.filter(f => !FIELDS_TO_EXCLUDE.includes(f.name)), [options]);
    const formID: string = useMemo(() => `dwsre_${options.modelName}`, [options]);
    const mode: "create" | "edit" = useMemo(() => !options.data ? "create" : "edit", [options]);
    
    // request handlers
    // const [fetchCreate, createLoading, createDoe] = useFetch(GetCRUDREQUEST(options.modelName, "store"));
    // const [fetchUpdate, updateLoading, updateDoe] = useFetch(GetCRUDREQUEST(options.modelName, "update"));

    // get from actions (based on mode)
    const getFormAction = useCallback(
        (): FormAction => mode === "create" ?
            ({ name: "create", displayName: "Create", onValidatedData: onCreateNewRecord, validation: options.createValidations})
        : 
            ({ name: "edit", displayName: "Update", onValidatedData: onUpdateRecord, validation: options.createValidations})
    , [widget]);

    // on create new record
    // form data already validated if validation was passed to the form action
    async function onCreateNewRecord(json: JSONType): Promise<DOE> {
        const doe: DOE = await sendRequest(GetCRUDREQUEST(options.modelName, "store"), json);
        
        if(doe.error){
            AlertService.showAlert({id: -1, text: "Error creating new record!", severity: "error"});
        }else{
            AlertService.showAlert({id: -1, text: "New record created successfuly!"});
        }

        return doe;
    }

    // on edit record
    async function onUpdateRecord(json: JSONType): Promise<DOE> {
        const doe: DOE = await sendRequest(GetCRUDREQUEST(options.modelName, "update"), json);
        return doe;
    }

    return (
        <section className='w-full'>

            <FormComp 
                formDef={{
                    id: formID,
                    title: options.title,
                    items: fields,
                    action: getFormAction(),
                }}
                data={options.data}
                hideTitle
            />

        </section>
    )

}
export default DWSingleRecordEditor
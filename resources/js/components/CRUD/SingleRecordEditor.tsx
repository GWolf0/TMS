import React, { useCallback, useMemo } from 'react'
import { FormAction, FormDef, FormItemDef } from '../../types/uiTypes';
import { z } from 'zod';
import { GetCRUDREQUEST, TableModel, TableModelName } from '../../requests/requests';
import FormComp from '../common/formComp/FormComp';
import { DOE, JSONType } from '../../types/common';
import { sendRequest } from '../../helpers/requestHelper';
import AlertService from '../../services/AlertService';
import { getTableModelDef, TableModelDef } from '../../helpers/tablesModelsHelper';

// returns a form to edit/create a record
function SingleRecordEditor({model, modelName, title, mode, data, hideTitle, onSuccess}: {
    model: TableModel, 
    modelName: TableModelName, 
    title?: string,
    mode: "create" | "update",
    data?: JSONType,
    hideTitle?: boolean,
    onSuccess?: (record: JSONType, mode: "create"|"update") => any,
}){
    const modelDef: TableModelDef = useMemo(() => getTableModelDef(model), [model]);
    const columns: string[] = useMemo(() => mode === "create" ? modelDef.createFields : modelDef.updateFields, [mode]);
    const validation: z.AnyZodObject | undefined = useMemo(() => mode === "create" ? modelDef.createValidation : modelDef.updateValidation, [mode]);
    const fields: FormItemDef[] = useMemo(() => modelDef.formItems.filter(fi => columns.includes(fi.name)), [columns]);
    const formAction: FormAction = useMemo(() => {
        if(mode === "create") {
            return {name: "create", displayName: "Create", onValidatedData: onCreateNewRecord, validation}
        } else {
            return {name: "update", displayName: "Update", onValidatedData: onUpdateRecord, validation}
        }
    }, [mode]);
    
    // on create new record
    // form data already validated if validation was passed to the form action
    async function onCreateNewRecord(json: JSONType): Promise<DOE> {
        const doe: DOE = await sendRequest(GetCRUDREQUEST(modelName, "store"), json);
        
        if(doe.error){
            AlertService.showAlert({id: -1, text: "Error creating new record!", severity: "error"});
        }else{
            AlertService.showAlert({id: -1, text: "New record created successfuly!"});
            if(doe.data && onSuccess) onSuccess(doe.data, "create");
        }

        return doe;
    }

    // on edit record
    async function onUpdateRecord(json: JSONType): Promise<DOE> {
        const doe: DOE = await sendRequest(GetCRUDREQUEST(modelName, "update"), json);
        
        if(doe.error){
            AlertService.showAlert({id: -1, text: "Error updating record!", severity: "error"});
        }else{
            AlertService.showAlert({id: -1, text: "Record updated successfuly!"});
            if(doe.data && onSuccess) onSuccess(doe.data, "update");
        }

        return doe;
    }

    return (
        <section className='w-full'>

            <FormComp 
                formDef={{
                    id: `single_record_editor_${mode}_${model}`,
                    title: title ?? `${mode} ${modelName}`,
                    items: fields,
                    action: formAction,
                }}
                data={data}
                hideTitle={hideTitle}
            />

        </section>
    )

}
export default SingleRecordEditor
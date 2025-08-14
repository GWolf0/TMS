import React, { useEffect, useMemo, useState } from 'react'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import FormFKChooserModal, { FK_FORM_MODAL_CHOOSER_ID } from '../../customModals/FormFKChooserModal'
import { ZodTypeAny } from 'zod'
import ErrorComp from '../ErrorComp'
import MSelect from '../../ui/MSelect'
import { FormAction, FormDef, FormItemDef } from '../../../types/uiTypes'
import { DOE, JSONType } from '../../../types/common'
import FormCompItem from './FormCompItem'
import { formFKLabelKey } from '../../../helpers/formHelper'
import { formatZodError, getInputAttributes, pickFromZod } from '../../../helpers/zodHelper'
import { LoaderCircleIcon } from 'lucide-react'
import { dataToInputData, dataToString } from '../../../helpers/dataHelper'

function FormComp({formDef, data, hideTitle}: {
    formDef: FormDef, data?: JSONType, hideTitle?: boolean,
}) {
    // states
    const [loading, setLoading] = useState<boolean>(false);
    const [doe, setDoe] = useState<DOE>({data: null, error: null});
    const [canPerformAction, setCanPerformAction] = useState<boolean>(true);
    
    // render items
    function renderFormItems(): React.ReactNode{
        return formDef.items.map((item, i) => (
            <div key={i} className='w-full flex flex-col gap-2'>
                { !["hidden", "boolean", "fk"].includes(item.type) && 
                    <Label className='opacity-80' htmlFor={item.name}>{ item.displayName }</Label> }

                {/* // try pass data to form item if exists, and fks if exists */}
                <FormCompItem 
                    item={item}
                    defaultValue={data && Object.hasOwn(data, item.name) ? 
                        dataToInputData(item.name, data[item.name], item.type) : 
                        undefined
                        }
                    fkLabel={data && data.labels && Object.hasOwn(data.labels, formFKLabelKey(item.name)) ? data.labels[formFKLabelKey(item.name)] : undefined}
                    inputProps={getFormItemInputsProps(item)}
                />
            </div>
        ))
    }

    // get form item input props (input confirmation attributes)
    function getFormItemInputsProps(item: FormItemDef): JSONType {
        // if specified explicitly in formdef itemsInputsProps
        if(formDef.itemsInputsProps && Object.hasOwn(formDef.itemsInputsProps, item.name)) {
            return formDef.itemsInputsProps[item.name];
        }
        // get from action zod validation
        if(formDef.action.validation) {
            const zodDef = formDef.action.validation.shape[item.name];
            if(zodDef) return getInputAttributes(zodDef);
        }
        // default to required except for boolean items
        return item.type !== "boolean" ? {required: true} : {required: false};
    }

    // on form submit
    async function onFormSubmit(e: React.FormEvent<HTMLFormElement>){
        // get formdata and action name
        const fd = new FormData(e.currentTarget);
        const action: FormAction = formDef.action;
        if(!action || action.authorization === false) return;

        if(!action.allowPageReload) e.preventDefault();
        if(!canPerformAction) return;

        // Get JSON from FormData
        let data: JSONType = Object.fromEntries(fd.entries());

        // Filter required fields if specified
        if(action.requiredFields && action.requiredFields.length > 0) {
            data = Object.fromEntries(
                Object.entries(data).filter(([key]) => action.requiredFields!.includes(key))
            );
        }

        // Format boolean fields
        for(const [key, val] of Object.entries(data)) {
            const fi = formDef.items.find(it => it.name === key);
            if(fi?.type === "boolean") {
                data[key] = val === "true" || val === "on" || val === "1";
            }
        }

        console.table(data);
        
        // validate zod if exists
        const keys = Object.keys(data);
        const filteredValidation = action.validation ? pickFromZod(action.validation, keys) : undefined;
        const validation = filteredValidation ? filteredValidation.safeParse(data) : {success: true, data, error: undefined};

        console.log(validation)

        // send request and/or perform callbacj if valid
        if(validation.success){
            // perform callback is defined
            if(action.onValidatedData){
                setLoading(true);
                setDoe({error: null});

                const doe: DOE = await action.onValidatedData(validation.data);

                setDoe(doe);
                setLoading(false);

                if(action.oneTimePerPageLoad) setCanPerformAction(false);
            }
        }else{
            setDoe({error: {message: "Validation error: " + formatZodError(validation.error)}});
        }
    }

    return (
        <div className='w-full flex flex-col gap-4'>
            { !hideTitle && <p className='text-lg underline'>{formDef.title}</p> }

            <form id={`form_${formDef.id}`} onSubmit={onFormSubmit}>
                {/* // error */}
                <ErrorComp error={doe.error} />

                {/* // items */}
                <div className='flex flex-col gap-4'>
                    { renderFormItems() }
                </div>

                {/* // action if authorized */}
                {<div className='flex gap-4 mt-8 items-center flex-row-reverse'>
                    <Button variant={"default"} type='submit' disabled={loading || formDef.action.authorization === false || !canPerformAction}>
                        { loading ? <LoaderCircleIcon className='animate-spin' /> : formDef.action.displayName }
                    </Button>
                </div>}
            </form>

        </div>
    )

}

export default FormComp;

import React, { useEffect, useMemo, useState } from 'react'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import FormFKChooserModal, { FK_FORM_MODAL_CHOOSER_ID } from '../../customModals/FormFKChooserModal'
import { ZodTypeAny } from 'zod'
import ErrorComp from '../ErrorComp'
import MSelect from '../../ui/MSelect'
import { FormAction, FormDef } from '../../../types/uiTypes'
import { DOE, JSONType } from '../../../types/common'
import FormCompItem from './FormCompItem'
import { formFKLabelKey } from '../../../helpers/formHelper'
import { pickFromZod } from '../../../helpers/zodHelper'

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
                    defaultValue={data && Object.hasOwn(data, item.name) ? data[item.name] : undefined}
                    fkLabel={data && data.labels && Object.hasOwn(data.labels, formFKLabelKey(item.name)) ? data.labels[formFKLabelKey(item.name)] : undefined}
                />
            </div>
        ))
    }

    // on form submit
    async function onFormSubmit(e: React.FormEvent<HTMLFormElement>){
        // get formdata and action name
        const fd = new FormData(e.currentTarget);
        const action: FormAction = formDef.action;
        if(!action || action.authorization === false) return;

        if(!action.allowPageReload) e.preventDefault();
        if(!canPerformAction) return;

        // get json from fd entries
        let data: JSONType = Object.fromEntries(fd.entries());
        
        // format boolean fields
        const entries = Object.entries(data);
        for(let i = 0; i < entries.length; i++) {
            const [key, val] = entries[i];
            console.log(key, val)
            const fi = formDef.items.find(it => it.name === key);
            if(fi?.type === "boolean") {
                data[i] = {key: Boolean(val)};
            }else {
                data[i] = {key: val};
            }
        }

        // include only required fields if specified
        if(action.requiredFields && action.requiredFields.length > 0) {
            data = Object.entries(data).filter(keyval => action.requiredFields?.includes(keyval[0]));
        }
        
        console.log("data", data, Object.keys(data));
        
        // validate zod if exists
        const keys = Object.keys(data);
        const filteredValidation = action.validation ? pickFromZod(action.validation, keys) : undefined;
        const validation = filteredValidation ? filteredValidation.safeParse(data) : {success: true, data};

        // console.log(validation)

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
            setDoe({error: {message: "Validation error"}});
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
                        { formDef.action.displayName }
                    </Button>
                </div>}
            </form>

        </div>
    )

}

export default FormComp;

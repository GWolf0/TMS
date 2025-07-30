import { DOE, JSONType } from '@/types/common'
import { FormAction, FormDef, FormItemDef } from '@/types/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { h_FormFKLabelKey, h_FormItemDisplayName } from '@/helpers/formHelper'
import { sendRequest } from '@/helpers/requestHelper'
import ModalService from '@/services/ModalService'
import FormFKChooserModal, { FK_FORM_MODAL_CHOOSER_ID } from '../modals/FormFKChooserModal'
import { ZodTypeAny } from 'zod'
import ErrorComp from './ErrorComp'
import MSelect from '../ui/MSelect'
import { getInputAttributes, pickFromZod } from '@/helpers/zodHelper'

function FormComp({formDef, data, hideTitle}: {
    formDef: FormDef, data?: JSONType, hideTitle?: boolean,
}) {
    // states
    const [loading, setLoading] = useState<boolean>(false);
    const [doe, setDoe] = useState<DOE>({data: null, error: null});
    
    // render items
    function renderFormItems(): React.ReactNode{
        return formDef.items.map((item, i) => (
            <div key={i} className='w-full flex flex-col gap-2'>
                { !["hidden", "boolean", "fk"].includes(item.type) && 
                    <Label className='opacity-80' htmlFor={item.name}>{ displayName(item) }</Label> }

                {/* // try pass data to form item if exists, and fks if exists */}
                { 
                    _renderFormItem(
                        item, 
                        data && Object.hasOwn(data, item.name) ? data[item.name] : undefined,
                        formDef.action.validation ? formDef.action.validation.shape[item.name] : undefined,
                        data && data.labels && Object.hasOwn(data.labels, getFKLabelKey(item)) ? data.labels[getFKLabelKey(item)] : undefined,
                    ) 
                }
            </div>
        ))
    }

    // on form submit
    async function onFormSubmit(e: React.FormEvent<HTMLFormElement>){
        // get formdata and action name
        const fd = new FormData(e.currentTarget);
        const action: FormAction = formDef.action;
        if(!action) return;

        if(!action.allowPageReload) e.preventDefault();

        // validate data
        // if requiredFields exists, then take only required fileds
        const data: JSONType = Object.fromEntries(action.requiredFields ? 
            fd.entries().filter(ent => action.requiredFields?.includes(ent[0])) : fd.entries());
        // validate zod if exists
        const filteredValidation = action.validation ? pickFromZod(action.validation, Object.keys(data)) : undefined;
        const validation = filteredValidation ? filteredValidation.safeParse(data) : {success: true, data};
        console.log(data);

        // send request and/or perform callbacj if valid
        if(validation.success){
            // perform callback is defined
            if(action.onValidatedData){
                setLoading(true);
                setDoe({error: null});

                const doe: DOE = await action.onValidatedData(validation.data);

                setDoe(doe);
                setLoading(false);
            }
            else if(action.httpRequest){
                setLoading(true);
                setDoe({error: null});

                const doe: DOE = await sendRequest(action.httpRequest, validation.data);

                setDoe(doe);
                setLoading(false);
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
                    <Button variant={"default"} type='submit' disabled={loading}>
                        { formDef.action.displayName || formDef.action.name.replaceAll("_", " ") }
                    </Button>
                </div>}
            </form>

        </div>
    )

}

export default FormComp;

// fk form item
// handle choosing of foreign key fields
function FormFKItem({item, id, label}: {
    item: FormItemDef, id?: number, label?: string,
}){
    const [data, setData] = useState<{id: number, label: string}>({id: id || 0, label: label || ""});

    useEffect(() => {
        // listen for event from fk field chooser modal to change data
        const onReceiveData = (e: Event)=>{
            const ev: CustomEvent<{data: {id: number, label: string}}> = e as CustomEvent;
            setData(ev.detail.data);
            console.log(`received data from fkchooser modal ${ev.detail.data}`);
        }
        window.addEventListener("fkchose", onReceiveData);

        return () => {
            window.removeEventListener("fkchose", onReceiveData);
        }
    }, []);

    function onChoose(){
        // open fk field chooser modal
        ModalService.showCustomModal({id: FK_FORM_MODAL_CHOOSER_ID, component: <FormFKChooserModal item={item} />})
    }

    return (
        <div className='flex gap-2 justify-between items-center border rounded p-2'>
            <input name={item.name} value={data.id} type='hidden' />

            <p>{ displayName(item) } : {data.label}</p>
            <Button size={'sm'} onClick={onChoose} type='button'>Choose</Button>
        </div>
    )

}

// formCSVInput
// handles inputs of csv format, allow add remove of items
function FormCSVItem({item, dataStr, separator}: {
    item: FormItemDef, dataStr?: string, separator?: string,
}){
    dataStr = dataStr || "";
    separator = separator || ",";
    const minCount: number = useMemo(() => item.meta?.csvMinCount || 0, [item]);
    const maxCount: number = useMemo(() => item.meta?.csvMaxCount || 100, [item]);
    const [data, setData] = useState<string[]>(dataStr.split(separator));

    function onNewItem(){
        setData(prev => [...prev, ""]);
    }

    function onRemoveItem(idx: number){
        setData(prev => prev.filter((_, i) => i !== idx));
    }

    // compute actual input value
    function getInputValue(): string{
        return data.slice(Math.min(data.length, maxCount)).join(separator);
    }

    return (
        <div className='flex flex-col gap-4 border p-2'>
            {/* // actual input */}
            <input name={item.name} type='hidden' value={getInputValue()} />

            {/* // list of items */}
            <ul className='w-full flex flex-col gap-2'>
                {
                    data.map((d, i) => (
                        <li key={i} className='relative flex items-center py-2 pr-8'>
                            {_renderFormItem(item, d)}

                            {/* // remove btn */}
                            {data.length -1 >= minCount &&
                                <Button className='absolute right-2 top-2 p-2' size={"sm"} variant={"ghost"} onClick={()=>onRemoveItem(i)}>
                                    <i className='bi bi-x-lg'></i>
                                </Button>
                            }
                        </li>
                    ))
                }
            </ul>

            {/* // add btn */}
            {data.length < maxCount && 
                <Button className='w-full' onClick={onNewItem}><i className='bi bi-plus-lg'></i> Add</Button>
            }
        </div>
    )

}

/*** HELPERS ***/

// get form item display name hepler (remove trailing _id from fk fields if exists and other _ characters)
const displayName = (item: FormItemDef): string => h_FormItemDisplayName(item.name, item.displayName);
// get form item name (ex: csv form items shouldn't include the field name)
const formItemName = (item: FormItemDef): string => item.meta?.isCSV ? "" : item.name;
// get fk label key
const getFKLabelKey = (item: FormItemDef) => h_FormFKLabelKey(item.name);

// render form item helper
// assuming fkLabel is a string representing user friendly value for fk fields if the item passed is an fk field type
function _renderFormItem(
    item: FormItemDef, 
    defaultValue: string | number | boolean | readonly string[] | undefined = undefined,
    zodType?: ZodTypeAny,
    fkLabel?: string,
): React.ReactNode{
    const inputProps = zodType != null ? getInputAttributes(zodType) : null;

    switch(item.type){
        case "hidden":
            return (
                <Input
                    name = {formItemName(item)}
                    type = 'hidden'
                    defaultValue = {item.name==="id"?defaultValue as string:item.meta?.hiddenVal}
                    {...inputProps}
                />
            )
        case "text":
            return (
                <Input
                    name = {formItemName(item)}
                    placeholder = {displayName(item)}
                    defaultValue={defaultValue as string}
                    {...inputProps}
                />
            )
        case "number":
            return (
                <Input
                    name = {formItemName(item)}
                    type = 'number'
                    placeholder = {displayName(item)}
                    defaultValue={defaultValue as number}
                    {...inputProps}
                />
            )
        case "boolean":
            return (
                <div className='flex gap-2'>
                    <label htmlFor={formItemName(item)}>{ displayName(item) }</label>
                    <input 
                        className='accent-primary'
                        name = {formItemName(item)}
                        type = 'checkbox'
                        defaultChecked={defaultValue as boolean}
                        {...inputProps}
                    />
                </div>
            )
        case "options":
            return (
                <MSelect 
                    name={formItemName(item)}
                    defaultValue={defaultValue as string}
                    options={item.meta?.optionsData}
                    attributes={inputProps}
                />
            )
        case "date":
            return (
                <Input
                    name = {formItemName(item)}
                    type = "date"
                    defaultValue={defaultValue as string}
                    {...inputProps}
                />
            )
        case "time":
            return (
                <Input 
                    name = {formItemName(item)}
                    type = "time"
                    defaultValue={defaultValue as string}
                    {...inputProps}
                />
            )
        case "fk":
            return (
                <FormFKItem item={item} id={Number(defaultValue)} 
                    label={fkLabel} 
                />
            )
        default:
            return <div>Unsupported field type: {item.type}</div>;
    }
}
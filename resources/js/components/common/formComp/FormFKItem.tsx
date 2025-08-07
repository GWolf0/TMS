// fk form item

import { useState, useEffect } from "react";
import ModalService from "../../../services/ModalService";
import { FormItemDef } from "../../../types/uiTypes";
import FormFKChooserModal, { FK_FORM_MODAL_CHOOSER_ID } from "../../customModals/FormFKChooserModal";
import { Button } from "../../ui/button";

// handle choosing of foreign key fields
export default function FormFKItem({item, id, label}: {
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

            <p>{ item.displayName } : {data.label}</p>
            <Button size={'sm'} onClick={onChoose} type='button'>Choose</Button>
        </div>
    )

}
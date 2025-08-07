import { modalContext, ModalContextProvider } from '../../contexts/modalContext';
import ModalService from '../../services/ModalService';
import { ModalDef } from '../../types/uiTypes';
import { Button } from '../ui/button'
import { Fragment, useContext, useEffect } from 'react';

// base modal component
function BaseModal({modal, fullScreen}: {
    modal: ModalDef, fullScreen?: boolean,
}) {

    function onClose() { ModalService.closeModal(modal.id); }

    // perform footer action (if action returns null, then trigger close)
    function onAction(action: () => any){
        const res = action();
        if(res === null) ModalService.closeModal(modal.id);
    }

    function renderModal(){
        return (
            <div className={`fixed flex flex-col ${!fullScreen?'top-10 left-1/2 -translate-x-1/2':'top-0 left-0 h-screen'} bg-background border shadow rounded`} style={{width: !fullScreen?"min(90vw, 720px)":"100%"}}>
                {/* // header */}
                <section className='w-full flex items-center justify-between py-4 px-4 border-b'>
                    {modal.header}
                    <Button variant={"outline"} size={"icon"} onClick={onClose}><i className='bi bi-x-lg'></i></Button>
                </section>
    
                {/* // content */}
                <section className='grow px-4 py-4 overflow-y-auto' style={{maxHeight: '80vh'}}>
                    {modal.content}
                </section>
    
                {/* // footer */}
                {modal.actions && <section className='p-4 flex items-center justify-end gap-4'>
                    {modal.actions.map((act, i) => (
                        <Button key={i} onClick={()=>onAction(act.action)}>{act.name}</Button>
                    ))}
                </section>}
            </div>
        );
    }

    return (
        <div className='fixed left-0 top-0 w-screen h-screen' style={{backgroundColor: "rgba(0,0,0,0.5)"}}>
            {renderModal()}
        </div>
    )

}

export default BaseModal

// modals component (wrap the consumer with provider to give access to the modals objects from context)
export function ModalsComp(){

    return (
        <ModalContextProvider>
            <ModalsCompHelperComp />
        </ModalContextProvider>
    )

}
    // provider consumer (renders all modals in context at once)
function ModalsCompHelperComp(){
    const {modals, customModals} = useContext(modalContext);

    // render modals container
    function renderContainer(content: React.ReactNode): React.ReactNode{
        if(modals.length < 1 && customModals.length < 1) return null;
        
        return (
            <div className='fixed top-0 left-0 bottom-0 right-0' style={{backgroundColor: "rgba(0,0,0,0.25)"}}>
                { content }
            </div>
        )
    }

    return (
        renderContainer(
            <>
                {/* // custom modal */}
                { customModals.map(m => ( <Fragment key={m.id}> {m.component} </Fragment> )) }

                {/* // basic modals */}
                { modals.map(m => ( <BaseModal key={m.id} modal={m} /> )) }
            </>
        )
    )
}
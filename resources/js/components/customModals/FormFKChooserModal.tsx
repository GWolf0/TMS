import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import BaseModal from '../common/BaseModals'
import { LoaderCircleIcon } from 'lucide-react';
import PaginationComp from '../common/PaginationComp';
import { FormItemDef } from '../../types/uiTypes';
import { DOE, PaginatedData } from '../../types/common';
import useRequest from '../../hooks/useRequest';
import { MISC_FK_LABELS_REQ } from '../../requests/requests';

export const FK_FORM_MODAL_CHOOSER_ID = -2;

// modal to choose foreign key item
function FormFKChooserModal({item}: {
    item: FormItemDef,
}) {
    // states / memos
    const [page, setPage] = useState<number>(1);
    const [paginatedOptions, setPaginatedOptions] = useState<PaginatedData<{id: number, label: string}>>();
    const options: {id: number, label: string}[] = useMemo(() => paginatedOptions?.data || [], [paginatedOptions]);
    const [selectedOption, setSelectedOption] = useState<number>(-1);

    // fetching hook
    const [fetchFKLabels, fetchFKLabelsLoading, fkLabelsDoe] = useRequest(MISC_FK_LABELS_REQ, true);

    useEffect(() => {
        // fetch options
        fetchFKLabels({table_name: item.meta!.fkTable}, `page=${page}`).then((doe: DOE) => setPaginatedOptions(doe.data ?? undefined));
    }, [page]);

    function renderHeader(): ReactNode{
        return (
            <p>Choose {item.displayName}</p>
        )
    }

    function renderContent(): ReactNode{
        return !fetchFKLabelsLoading ?(
            <div className='w-full flex flex-col gap-4 overflow-y-auto' style={{maxHeight: '80vh'}}>
                {/* // list of options */}
                <ul className='w-full flex flex-col'>
                    {
                        options.map((opt, i) => (
                            <li key={i} className={`flex items-center gap-4 py-2 ${selectedOption===i&&'opacity-80 text-blue-500'} cursor-pointer border-b`} onClick={()=>onSelectOption(i)}>
                                <p className=''>{opt.label}</p>
                            </li>
                        ))
                    }
                </ul>

                {/* // pagination if required */}
                {paginatedOptions && paginatedOptions.total != options.length &&
                    <PaginationComp 
                        pInfo={paginatedOptions}
                        onPage={(p: number) => setPage(p)}
                    />
                }
            </div>
        ) : (
            <div className='w-full p-8 flex items-center justify-center'>
                <LoaderCircleIcon className='animate-spin' />
            </div>
        )
    }

    function getActions(): { name: string, action: () => any}[] | undefined {
        return [
            { name: "Ok", action: onConfirm},
            { name: "Cancel", action: () => null},
        ];
    }

    // on select option
    function onSelectOption(idx: number){
        setSelectedOption(prev => prev === idx ? -1 : idx);
    }

    // on confirm
    function onConfirm(){
        if(selectedOption < 0) return;
        window.dispatchEvent(
            new CustomEvent<{data: {id: number, label: string}}>(
                "fkchose", 
                { detail: { data: options[selectedOption] } }
            )
        );
        return null;
    }

    return (
        <BaseModal 
            modal={
                {
                    id: FK_FORM_MODAL_CHOOSER_ID,
                    header: renderHeader(),
                    content: renderContent(),
                    actions: getActions(),
                }
            }
        />
    )

}

export default FormFKChooserModal
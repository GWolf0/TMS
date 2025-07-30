import { PaginationInfo } from '@/types/common'
import React from 'react'
import { Button } from '../ui/button'

// pagination component
// if auto is true, then a "page=number" query param will be appended to the url queryparams
function PaginationComp({pInfo, auto, onPage}: {
    pInfo: PaginationInfo, auto?: boolean, onPage?: (pageNumber: number) => any,
}) {

    function _onPage(num: number){
        if(auto){
            let sp = new URLSearchParams(window.location.search);
            sp.set("page", num.toString());
            location.search = sp.toString();
        }else{
            if(onPage) onPage(num);
        }
    }

    return(
        <div className='flex items-center justify-center gap-1 py-2 px-4'>
            <Button onClick={()=>_onPage(1)} size={"icon"} variant={"link"}><i className='bi bi-chevron-left'></i></Button>
            {
                Array(pInfo.last_page).fill(null).map((_, i) => (
                    <Button onClick={()=>_onPage(i+1)} key={i} size={"icon"} variant={pInfo.current_page == i + 1 ? "default" : "link"}>{i + 1}</Button>
                ))
            }
            <Button onClick={()=>_onPage(pInfo.last_page)} size={"icon"} variant={"link"}><i className='bi bi-chevron-right'></i></Button>
        </div>
    )

}

export default PaginationComp
import React from 'react'
import { Button } from '../ui/button'
import { PaginationInfo } from '../../types/common';

// pagination component
// if auto is true, then a "page=number" query param will be appended to the url queryparams
function PaginationComp({pInfo, auto, onPage}: {
    pInfo: PaginationInfo, auto?: boolean, onPage?: (pageNumber: number) => any,
}) {
    const MAX_RANGE = 7;
    const fromPage = Math.max(1, Math.floor(pInfo.current_page - MAX_RANGE / 2));
    const toPage = Math.min(pInfo.last_page, Math.floor(pInfo.current_page + MAX_RANGE / 2));
    const pagesRange: number[] = Array.from({length: toPage - fromPage}, (_, i) => i + fromPage);

    function _onPage(num: number){
        if(auto && pInfo.current_page != num){
            let sp = new URLSearchParams(window.location.search);
            sp.set("page", num.toString());
            location.search = sp.toString();
        }else{
            if(onPage) onPage(num);
        }
    }

    return pInfo.current_page != pInfo.last_page && (
        <div className='flex items-center justify-center gap-1 py-2 px-4'>
            <Button onClick={()=>_onPage(1)} size={"icon"} variant={"link"}><i className='bi bi-chevron-double-left'></i></Button>
            {
                pagesRange.map((pageNum, i) => (
                    <Button onClick={()=>_onPage(pageNum)} key={i} size={"icon"} variant={pInfo.current_page == pageNum ? "default" : "link"}>
                        {pageNum}
                    </Button>
                ))
            }
            <Button onClick={()=>_onPage(pInfo.last_page)} size={"icon"} variant={"link"}><i className='bi bi-chevron-double-right'></i></Button>
        </div>
    )

}

export default PaginationComp
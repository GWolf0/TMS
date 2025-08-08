import React, { useMemo } from 'react'
import { Button } from '../ui/button'

// Tabs Buttons
// renders tabs buttons (changes location's pathname)
function TabsButtons({tabs}: {
    tabs: {name: string, displayName: string, pathName: string}[]
}) {
    const curTabIdx: number = useMemo(() => Math.max(0, tabs.findIndex(t => t.pathName === location.pathname)), [tabs]);

    // on tab (update the affected pathname segment with the requested tab name, and remove search query)
    function onTab(idx: number){
        let url = new URL(location.href);
        url.search = "";
        url.pathname = tabs[idx].pathName;
        location.href = url.href;
    }

    return (
        <div className='flex p-2 items-center gap-2 md:gap-2.5 overflow-x-auto bg-muted rounded'>
            {
                tabs.map((t, i) => (
                    <Button key={i} 
                        className='disabled:opacity-100'
                        variant={curTabIdx === i ? "default" : "link"}
                        disabled={curTabIdx === i}
                        onClick={()=>onTab(i)}
                    >
                        {t.displayName}
                    </Button>
                ))
            }
        </div>
    )

}

export default TabsButtons
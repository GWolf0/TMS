import React, { useMemo } from 'react'
import { Button } from '../ui/button'

// Tabs Buttons
// renders tabs buttons (changes location's pathname)
function TabsButtons({tabs}: {
    tabs: {name: string, displayName: string, pathName: string}[]
}) {
    const curTabIdx: number = useMemo(() => Math.max(0, tabs.findIndex(t => t.pathName === location.pathname)), [tabs]);

    // on tab (update the affected pathname segment with the requested tab name)
    function onTab(idx: number){
        location.pathname = tabs[idx].pathName;
    }

    return (
        <div className='flex p-2 items-center gap-2 md:gap-4 overflow-x-auto bg-muted rounded'>
            {
                tabs.map((t, i) => (
                    <Button key={i} 
                        variant={curTabIdx === i ? "default" : "outline"}
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
import React, { ReactNode } from "react";

// base header
export function BaseHeader({logo, items}: {
    logo: ReactNode, items: ReactNode[],
}){

    return (
        <header className="flex items-center justify-between px-4 bg-background border-b" style={{height: `80px`}}>
            {logo}
            <div className="flex items-center gap-4">
                {...items}
            </div>
        </header>
    );

}

// base footer
export function BaseFooter({items, appName}: {
    items: Array<{title: string, items: {name: string, link: string}[]}> | {name: string, link: string}[],
    appName: string,
}){

    // render items
    function renderItems(){
        const isGroupedByTitle: boolean = items.length > 0 && Object.hasOwn(items[0], "title");

        if(isGroupedByTitle){
            return (
                items as Array<{title: string, items: {name: string, link: string}[]}>).map((item, i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <p className="font-bold">{item.title}</p>
                        <ul className="flex flex-col gap-2 items-center">
                            {
                                item.items.map((it, j) => (
                                    <a key={j} href={`${it.link}`} className="py-2">
                                        {it.name}
                                    </a>
                                ))
                            }
                        </ul>
                    </div>
                )
            )
        }else{
            return (
                <ul className="w-full flex flex-col md:flex-row gap-2 md:gap-4 items-center justify-center">
                    {
                        (items as {name: string, link: string}[]).map((item, i) => (
                            <a key={i} href={`${item.link}`} className="py-2 text-sm font-light hover:underline">
                                {item.name}
                            </a>
                        ))
                    }
                </ul>
            );
        }
    }

    return (
        <footer className="flex flex-col gap-4 px-4 bg-background border-t border-dashed" style={{height: `80px`}}>
            {/* // items */}
            <section className="flex gap-2 py-4">
                {renderItems()}
            </section>

            {/* // copy and app name */}
            <div className="flex items-center justify-end py-4 text-xs">
                <p>&copy; {appName} {new Date().getFullYear()}</p>
            </div>
        </footer>
    );

}
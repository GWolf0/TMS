import React, { useEffect, useMemo, useRef, useState } from 'react'
import FormComp from './formComp/FormComp'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { JSONType, DOE } from '../../types/common';
import { FormItemDef, FormItemOptionDataPair } from '../../types/uiTypes';
import MSelect from '../ui/MSelect';

// search component
// auto fills from url query params
// refreshes url with search params (typically used by the backend to filter records to send)
function SearchComp({formItems, mainSearchItemIdx, sortingItems}: {
    formItems: FormItemDef[], 
    mainSearchItemIdx: number,
    sortingItems?: FormItemOptionDataPair[],
}) {
    // if form items is empty return null
    if(formItems.length === 0) return null;

    // refs
    const mainSearchItemInputRef = useRef<HTMLInputElement>(null);

    // states and memos
    const mainSearchItem: FormItemDef = useMemo(() => formItems[mainSearchItemIdx], [mainSearchItemIdx]);
    const [showFilters, setShowFilters] = useState<boolean>(false); // toggle more filters section
    // prepared fileds (fields transformed for filtering based on field type)
    const preparedFields: FormItemDef[] = useMemo(() => prepareFormItems(formItems), [formItems]);
    
    // get data from query string (passed to form at page load to fill)
    const data: JSONType = Object.fromEntries(new URLSearchParams(location.search).entries());

    const filterKeys = Object.keys(data);
    const hasFilters: boolean = filterKeys.length > 0 && !(filterKeys.length === 1 && filterKeys[0] === "page");

    useEffect(() => {
        if(mainSearchItemInputRef.current) {
            const val = data[mainSearchItem.name];
            if(val) mainSearchItemInputRef.current.value = val.replace(/^l_/, '');
        }
    }, []);

    // prepare form items for adequate filterable fields
    function prepareFormItems(formItems: FormItemDef[]): FormItemDef[]{
        let res: FormItemDef[] = structuredClone(formItems);

        // remove main search fields
        res = res.filter((f, i) => i !== mainSearchItemIdx);

        // transform fileds
        for(let i = 0; i < res.length; i++){
            let f = res[i];
            
            // transform number type fields into min and max filters
            if(f.type === "number"){
                const subtituteWith: FormItemDef[] = [
                    {...structuredClone(f), name: `${f.name}_min`, displayName: `${f.name} Min`},
                    {...structuredClone(f), name: `${f.name}_max`, displayName: `${f.name} Max`},
                ];
                res.splice(i, 1, ...subtituteWith);
                i++; // skip last added fields
            }else if(f.type === "options") { // add any(*) for options fields
                f.meta?.optionsData?.unshift({id: "*", label: "any"} as FormItemOptionDataPair);
            }
        }

        return res;
    }

    // prepare ket value for submit
    function prepareKeyValue(name: string, value: any): {name: string, value: any}{
        let res = {name, value};

        let item: FormItemDef | undefined = formItems.find(f => f.name === name);
        if(!item) return res;

        // handle number fields (min/max)
        if(item.type === "number"){
            const sv = item.name.split("_");
            const last = sv[sv.length - 1];
            if(["min", "max"].includes(last)){
                res.name = sv.slice(0, -1).join("_");
                res.value = last === "min" ? `lte_${value}` : `gte_${value}`;
            }
        }

        return res;
    }

    // on search
    function onSearch(filters?: JSONType){
        let currSQ = new URLSearchParams();

        // append main search item value if not empty
        if(mainSearchItemInputRef.current && mainSearchItemInputRef.current.value != ""){
            currSQ.set(mainSearchItem.name, mainSearchItemInputRef.current ? `l_${mainSearchItemInputRef.current.value}` : "");
        }

        // append filters if exists and showFilters is true
        if(showFilters && filters) Object.entries(filters).forEach(([k, v]) => {
            if(v && v !== "*"){ // * for all
                const transformed = prepareKeyValue(k, v);
                currSQ.set(transformed.name, transformed.value.toString()); 
            }
        });

        // refresh
        location.search = currSQ.toString();
    }

    // on apply filters
    async function onApplyFilters(json: JSONType): Promise<DOE>{
        onSearch(json);
        
        // had to return a promise<DOE> as it is required by the form component action
        return {data: null, error: null};
    }

    function onClearFilters() {
        location.search = "";
    }

    function onSortingChanged(value: string) {
        let currSQ = new URLSearchParams(location.search);
        currSQ.append("s", value);
        location.search = currSQ.toString();
    }

    // render search filter form
    function renderSearchFiltersForm(): React.ReactNode {
        return (
            <FormComp 
                formDef={{
                    id: "search_form",
                    title: "Filters",
                    items: preparedFields,
                    action: { name: "apply", displayName: "Apply", onValidatedData: onApplyFilters },
                }}
                data = {data}
                hideTitle = {true}
            />
        )
    }

    // render sorting options
    function renderSortingOptions(): React.ReactNode {
        if(!sortingItems) return null;

        const value = Object.hasOwn(data, "s") ? data["s"] : "";

        return (
            <MSelect 
                name="s"
                defaultValue={value}
                options={sortingItems}
                onChanged={onSortingChanged}
            />
        )
    }

    return (
        <section className='flex flex-col gap-4'>
            {/* // Main search item */}
            <div className='flex gap-2 items-center'>
                { renderSortingOptions() }
                
                <div className='grow'>
                    <Input ref={mainSearchItemInputRef} className='w-full' placeholder={"Search by " + (mainSearchItem.displayName || mainSearchItem.name.replaceAll("_", " "))} />
                </div>
                
                <Button variant={"secondary"} size={"icon"} onClick={(e)=>onSearch()}><i className='bi bi-search'></i></Button>
                
                {!hasFilters ?
                    <Button variant={"secondary"} size={"icon"} onClick={()=>setShowFilters(prev=>!prev)} disabled={formItems.length <= 1}>
                        <i className={`bi ${showFilters ? 'bi-x-lg' : 'bi-filter'}`}></i>
                    </Button>
                    :
                    <Button variant={"secondary"} size={"icon"} onClick={onClearFilters}>
                        <i className={`bi bi-x-lg`}></i>
                    </Button>
                }
            </div>

            {/* // Filters */}
            {showFilters &&
                <div className='border p-4'>
                    { renderSearchFiltersForm() }
                </div>
            }
        </section>
    )

}

export default SearchComp
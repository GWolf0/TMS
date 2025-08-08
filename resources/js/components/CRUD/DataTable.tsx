import React, { useMemo } from 'react'
import { Button } from '../ui/button';
import { JSONType, PaginatedData } from '../../types/common';
import PaginationComp from '../common/PaginationComp';
import { formFKLabelKey } from '../../helpers/formHelper';
import { FormItemDef } from '../../types/uiTypes';
import { dataToString } from '../../helpers/dataHelper';
import { strStripFKTrail } from '../../helpers/stringHelper';


// defining an action for data table
export interface DataTableActionDef{name: string, callback: (rowIdx: number, data: JSONType)=>any, icon?: string};
export interface DataTableTopActionDef{name: string, callback: ()=>any, icon?: string};

// DataTable
// displays a table of paginated data, with optional actions for each row
function DataTable({title, pdata, actions, substituteFKsWithLabels, hiddenKeys, only, formItems, topActions, substituteColumns}: {
    title?: string, pdata: PaginatedData<JSONType>, actions: DataTableActionDef[], substituteFKsWithLabels?: boolean, hiddenKeys?: string[],
    only?: string[] ,formItems?: FormItemDef[], topActions?: DataTableTopActionDef[], substituteColumns?: JSONType,
}) {
    const data: JSONType[] = useMemo(() => pdata.data, [pdata]);
    const hasLabels: boolean = useMemo(() => data && data.length > 0 && Object.hasOwn(data[0], "labels"), [data]);
    // filter columns names based on hiddenKeys or only
    const colsNames: string[] = useMemo(() => data.length > 0 ? 
        (
            hiddenKeys != undefined ?
            Object.keys(data[0]).filter(key => !hiddenKeys.includes(key)) : 
            only != undefined ?
            Object.keys(data[0]).filter(key => only.includes(key)) : 
            Object.keys(data[0])
        ) :
        [],
    [data, hiddenKeys]);
    const hasActions: boolean = useMemo(() => actions.length > 0, [actions]);

    // Actions
    function getValue(rowIdx: number, name: string, d: any): string{
        const isFKValue: boolean = name.endsWith("_id");

        if(isFKValue && substituteFKsWithLabels && hasLabels && Object.hasOwn(data[rowIdx], "labels")){
            const value: string | null = data[rowIdx]["labels"][formFKLabelKey(name)];
            return value == null ? "N/A" : String(value);
        }else{
            if(formItems) {
                const formItem: FormItemDef | undefined = formItems.find(fi => fi.name === name);
                return formItem != undefined ? dataToString(name, d, formItem.type) : String(d);
            } else {
                return String(d);
            }
        }
    }

    // render action
    function renderAction(action: DataTableActionDef, rowIdx: number, data: JSONType){
        return (
            <Button title={action.name} onClick={()=>action.callback(rowIdx, data)} size={"icon"} variant={"secondary"}>
                {action.icon && <i className={`${action.icon}`}></i>}
                {!action.icon && action.name}
            </Button>
        )
    }

    // render top actions
    function renderTopActions(): React.ReactNode {
        if(!topActions || topActions.length < 1) return null;

        return (
            <div className='ml-auto flex gap-2 items-center'>
                {
                    topActions.map((act, i) => (
                        <Button key={i} onClick={act.callback} variant={"secondary"}>
                            {act.icon && <i className={`${act.icon}`}></i>} {act.name}
                        </Button>
                    ))
                }
            </div>
        )
    }

    // render table
    function renderTable(){
        function getColName(colName: string): string {
            if(substituteColumns && Object.keys(substituteColumns).includes(colName)){
                return substituteColumns[colName];
            }
            return substituteFKsWithLabels ? strStripFKTrail(colName) : colName;
        }

        return (
            <div className='w-full overflow-x-auto'>
                <table className='w-full text-xs md:text-sm'>
                    <thead>
                        <tr className='border-b'>
                            {
                                colsNames.map((colName, i) => (
                                    <td key={i} className='p-2 font-bold'>{getColName(colName)}</td>
                                ))
                            }
                            {hasActions && data.length > 0 &&
                                <td className='p-2 font-bold'>Actions</td>
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {
                            data.map((row, i) => (
                                <tr key={i} className='border-b'>
                                    {
                                        Object.entries(row).filter((keyVal, j) => colsNames.includes(keyVal[0])).map((keyVal, j) => (
                                            <td key={j} className='p-2'>{ getValue(i, colsNames[j], keyVal[1]) }</td>
                                        ))
                                    }
                                    {hasActions && data.length > 0 &&
                                    (
                                        <td className='p-2 flex gap-0.5 md:gap-2 justify-end'>
                                            {
                                                actions.map((act, j) => (
                                                    <React.Fragment key={j}>
                                                        {renderAction(act, i, row)}
                                                    </React.Fragment>
                                                ))
                                            }
                                        </td>
                                    )
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-4'>
            <p className='font-bold'>{title}</p>

            <div className='flex items-center'>
                <p className='text-xs'>Showing {data.length} from {pdata.total}</p>
                { renderTopActions() }
            </div>

            {renderTable()}

            <PaginationComp pInfo={pdata} auto />
        </div>
    )

}

export default DataTable
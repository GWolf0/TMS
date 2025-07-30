import { JSONType, PaginatedData, PaginationInfo } from '@/types/common'
import React, { useMemo } from 'react'
import PaginationComp from './PaginationComp';
import { Button } from '../ui/button';
import { h_FormFKLabelKey } from '@/helpers/formHelper';


// defining an action for data table
export interface DataTableActionDef{name: string, callback: (rowIdx: number, data: JSONType)=>any, icon?: string};

// DataTable
// displays a table of paginated data, with optional actions for each row
function DataTable({title, pdata, actions, substituteFKsWithLabels}: {
    title?: string, pdata: PaginatedData<JSONType>, actions: DataTableActionDef[], substituteFKsWithLabels?: boolean,
}) {
    const data: JSONType[] = useMemo(() => pdata.data, [pdata]);
    const hasLabels: boolean = useMemo(() => data && data.length > 0 && Object.hasOwn(data[0], "labels"), [data]);
    const colsNames: string[] = useMemo(() => data.length > 0 ? Object.keys(data[0]) : [], [data]);
    const hasActions: boolean = useMemo(() => actions.length > 0, [actions]);

    // Actions
    function getValue(rowIdx: number, name: string, d: any): string{
        const isFKValue: boolean = String(d).endsWith("_id");
        if(isFKValue && substituteFKsWithLabels && hasLabels && Object.hasOwn(data[rowIdx], "labels")){
            const value: string = data[rowIdx]["labels"][h_FormFKLabelKey(name)];
            return value;
        }else{
            return String(d);
        }
    }

    // render action
    function renderAction(action: DataTableActionDef, rowIdx: number, data: JSONType){
        return (
            <Button title={action.name} onClick={()=>action.callback(rowIdx, data)} size={"icon"}>
                {action.icon && <i className={`${action.icon}`}></i>}
                {!action.icon && action.name}
            </Button>
        )
    }

    // render table
    function renderTable(){
        return (
            <div className='w-full overflow-x-auto'>
                <table className='w-full text-xs md:text-sm'>
                    <thead>
                        <tr className='border-b'>
                            {
                                colsNames.map((colName, i) => (
                                    <td key={i} className='p-2 font-bold'>{colName}</td>
                                ))
                            }
                            {hasActions &&
                                <td className='p-2 font-bold'>Actions</td>
                            }
                        </tr>
                    </thead>

                    <tbody>
                        {
                            data.map((row, i) => (
                                <tr key={i} className='border-b'>
                                    {
                                        Object.values(row).map((val, j) => (
                                            <td key={j} className='p-2'>{ getValue(i, colsNames[j], val) }</td>
                                        ))
                                    }
                                    {hasActions &&
                                        actions.map((act, j) => (
                                            <td key={j} className='p-2'>
                                                <div className='flex gap-0.5 md:gap-2 justify-end'>
                                                    { renderAction(act, i, row) }
                                                </div>
                                            </td>
                                        ))
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

            <p className='text-xs'>Showing {data.length} from {pdata.total}</p>

            {renderTable()}

            <PaginationComp pInfo={pdata} auto />
        </div>
    )

}

export default DataTable
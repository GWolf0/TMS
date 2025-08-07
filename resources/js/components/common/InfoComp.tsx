import React, { useMemo } from 'react'
import { FormItemDef } from '../../types/uiTypes';
import { JSONType } from '../../types/common';
import { dataToString } from '../../helpers/dataHelper';

// A component to display data based on data type (FormItemDef[] for this project)
function InfoComp({items, data, title, substituteFKsWithLabels, substituteColumns}: {
    items: FormItemDef[], data: JSONType, title: string, substituteFKsWithLabels?: boolean, substituteColumns?: JSONType,
}) {
    const hasLabels: boolean = useMemo(() => Object.hasOwn(data, "labels"), [data]);

    // actions
    function getValue(item: FormItemDef, d: any): string{
        if(item.type === "fk" && substituteFKsWithLabels && hasLabels){
            return dataToString(item.name, d, item.type, data["labels"]);
        }
        return dataToString(item.name, d, item.type);
    }

    function getColName(colName: string): string {
        if(substituteColumns && Object.keys(substituteColumns).includes(colName)){
            return substituteColumns[colName];
        }
        return colName;
    }

    return (
        <section>
            <p>{title}</p>

            <table className='flex flex-col gap-4 mt-8'>

                <tbody className='bg-muted rounded'>

                    {
                        items.filter(it => Object.keys(data).includes(it.name)).map((it, i) => (
                            <tr key={i} className=''>
                                <td className='p-4 text-foreground underline'>
                                    { getColName(it.displayName) }
                                </td>
                                <td className='p-4 text-foreground'>
                                    { getValue(it, data[it.name]) }
                                </td>
                            </tr>
                        ))
                    }

                </tbody>

            </table>
        </section>
    )

}

export default InfoComp

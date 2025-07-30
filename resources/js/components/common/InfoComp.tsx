import { dataToString } from '@/helpers/dataHelper'
import { h_FormFKLabelKey, h_FormItemDisplayName } from '@/helpers/formHelper'
import { JSONType } from '@/types/common'
import { FormItemDef } from '@/types/ui'
import React, { useMemo } from 'react'

// A component to display data based on data type (FormItemDef[] for this project)
function InfoComp({items, data, title, substituteFKsWithLabels}: {
    items: FormItemDef[], data: JSONType, title: string, substituteFKsWithLabels?: boolean,
}) {
    const hasLabels: boolean = useMemo(() => Object.hasOwn(data, "labels"), [data]);

    // actions
    function getValue(item: FormItemDef, d: any): string{
        if(item.type === "fk" && substituteFKsWithLabels && hasLabels){
            return dataToString(item.name, d, item.type, data["labels"]);
        }
        return dataToString(item.name, d, item.type);
    }

    return (
        <section>
            <p>{title}</p>

            <table className='flex flex-col gap-4'>

                <tbody>

                    {
                        items.filter(it => Object.keys(data).includes(it.name)).map((it, i) => (
                            <tr key={i}>
                                <td>
                                    { h_FormItemDisplayName(it.name, it.displayName) }
                                </td>
                                <td>
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

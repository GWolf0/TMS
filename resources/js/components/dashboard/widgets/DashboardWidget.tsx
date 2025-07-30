import { DashboardWidgetDef, DWCustomOptions } from '@/types/dashboard'
import React from 'react'
import DWDataTable from './DWDataTable'
import DWSingleRecordEditor from './DWSingleRecordEditor'

// Returns the appropriate dashboard widget based on passed params
function DashboardWidget({widget}: {
    widget: DashboardWidgetDef,
}) {

    return(
        widget.type === "single_record_editor" ? <DWSingleRecordEditor widget={widget} /> :
        widget.type === "data_table" ? <DWDataTable widget={widget} /> :
        (widget.options as DWCustomOptions).component
    )

}

export default DashboardWidget
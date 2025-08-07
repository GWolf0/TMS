import React from 'react'
import FormComp from '../../../components/common/formComp/FormComp'
import { JSONType } from '../../../types/common'
import { AdminDashboardPageData } from '../../../types/responsesTypes'
import { TableModel, TableModelName } from '../../../requests/requests'
import { getTableModelDef, TableModelDef } from '../../../helpers/tablesModelsHelper'
import SingleRecordEditor from '../../../components/CRUD/SingleRecordEditor'

function AdminDashboardTMSSystemSection({data}: {
  data: AdminDashboardPageData,
}) {
  const jsonData: JSONType | undefined = data.data;
  if(!jsonData) return <p>Error: no data received!</p>

  const model: TableModel = TableModel.tms_system;
  const modelName: TableModelName = "tms_system";

  return (
    <>
      <SingleRecordEditor
        mode='update'
        model={model}
        modelName={modelName}
        data={jsonData}
        title='TMS System'
      />
    </>
  )

}

export default AdminDashboardTMSSystemSection
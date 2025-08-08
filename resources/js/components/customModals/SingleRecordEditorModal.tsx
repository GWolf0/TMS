import React from 'react'
import BaseModal from '../common/BaseModals'
import { JSONType } from '../../types/common';
import z, { record } from 'zod';
import { TableModel, TableModelName } from '../../requests/requests';
import SingleRecordEditor from '../CRUD/SingleRecordEditor';

export const SINGLE_RECORD_EDITOR_MODAL_ID = -1;

// Modal to create/edit a record
function SingleRecordEditorModal({model, modelName, title, mode, data, onSuccess}: {
    model: TableModel, 
    modelName: TableModelName, 
    title?: string,
    mode: "create" | "update",
    data?: JSONType,
    onSuccess?: (record: JSONType, mode: "create"|"update") => any,
}) {

    function getTitle(): string { return `${mode} ${String(modelName)}`; }

    // render fns
    function renderHeader(): React.ReactNode{
        return (
            <p className='capitalize'>{ getTitle() }</p>
        );
    }

    // render content
    function renderContent(): React.ReactNode{
        return (
            <SingleRecordEditor 
                model={model}
                modelName={modelName}
                title={title}
                mode={mode}
                data={data}
                onSuccess={onSuccess}
                hideTitle
            />
        )
    }

    return (
        <BaseModal 
            modal={{
                id: SINGLE_RECORD_EDITOR_MODAL_ID,
                header: renderHeader(),
                content: renderContent(),
            }}
            fullScreen
        />
    )

}

export default SingleRecordEditorModal
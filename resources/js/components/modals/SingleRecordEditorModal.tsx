import React from 'react'
import BaseModal from '../common/BaseModals'
import { JSONType } from '@/types/common'
import { ModelsNames } from '@/requests/requests'
import DWSingleRecordEditor from '../dashboard/widgets/DWSingleRecordEditor';
import { DWSingleRecordEditorOptions } from '@/types/dashboard';
import { getFormItemsFromZod, getZodFromModelName } from '@/helpers/zodHelper';

export const SINGLE_RECORD_EDITOR_MODAL_ID = -1;

// Modal to create/edit a record
function SingleRecordEditorModal({mode, record, modelName}: {
    mode: "create" | "edit", record?: JSONType | null, modelName: ModelsNames,
}) {

    function getTitle(): string { return `${mode} ${String(modelName)}`; }

    // render header
    function renderHeader(): React.ReactNode{
        return (
            <p className='capitalize'>{ getTitle() }</p>
        );
    }

    // render content
    function renderContent(): React.ReactNode{
        return (
            <DWSingleRecordEditor 
                widget={{
                    type: "single_record_editor",
                    options: {
                        title: getTitle(),
                        modelName: modelName,
                        fields: getFormItemsFromZod(getZodFromModelName(modelName)),
                        data: record,
                        createValidations: getZodFromModelName(modelName),
                    } as DWSingleRecordEditorOptions
                }}
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
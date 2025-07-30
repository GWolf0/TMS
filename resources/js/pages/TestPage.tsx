import { ModalsComp } from '@/components/common/BaseModals';
import FormComp from '@/components/common/FormComp';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';
import ModalService from '@/services/ModalService';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react'
import { z } from "zod";

function TestPage() {

    return (
        <MainLayout>

                {/* // form */}
                <FormComp 
                    formDef={{
                        id: "test-form",
                        title: "Test Form",
                        items: [
                            { name: "name", type: "text" },
                            { name: "count", type: "number" },
                            { name: "is_true", type: "boolean" },
                            { name: "option", type: "options", meta: {optionsData: ["opt1", "opt2", "opt3"]} },
                            { name: "some_date", type: "date" },
                            { name: "some_time", type: "time" },
                            { name: "fk_val", type: "fk", meta: {fkTable: "tableName"} },
                        ],
                        actions: [
                            { name: "action_one", httpRequest: { url: "", method: "POST" }, isPrimary: true, validation:
                                z.object({
                                    name: z.string(),
                                    count: z.number({coerce: true}),
                                })
                            },
                            { name: "action_two", httpRequest: { url: "", method: "POST" } },
                        ]
                    }}
                    data={{
                        name: "Test name",
                        is_true: true,
                        option: "opt2",
                        some_date: new Date().toISOString().substring(0, 10),
                        some_time: new Date().toTimeString().substring(0, 8),
                    }}
                />

                {/* // test modals */}
                <div className='flex items-center gap-4 mt-8 flex-wrap'>
                    {/* // custom modal */}
                    <Button onClick={()=>ModalService.showModal({ id: -1, header: <p>Title</p>, content: <p>Content.</p> })}>
                        Open Test Modal
                    </Button>
                    {/* // alert modal */}
                    <Button onClick={()=>ModalService.showAlert("This is an alert modal")}>
                        Open Alert Modal
                    </Button>
                    {/* // confirm modal */}
                    <Button onClick={()=>ModalService.showConfirm("This is a confirm modal", (value: boolean )=>console.log(`Got ${value}`))}>
                        Open Confirm Modal
                    </Button>
                </div>

        </MainLayout>
    )

}

export default TestPage
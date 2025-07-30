import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/useFetch'
import { ADMIN_START_RESERVATIONS_PROCESSING_REQ } from '@/requests/requests';
import { DOE } from '@/types/common';
import { LoaderCircleIcon } from 'lucide-react';
import React from 'react'

function DWAdminActionsWidget({authorizations, is_processing_shifts}: {
    authorizations: { start_reservations_processing: boolean, }, is_processing_shifts: boolean,
}) {
    // fetch actions
    const [performStartReservationsProcessing, srpLoading, srpDoe] = useFetch(ADMIN_START_RESERVATIONS_PROCESSING_REQ);

    // Actions
    // on start reservations processing
    async function onStartReservationsProcessing() {
        if(!authorizations.start_reservations_processing || srpLoading) return;
        if(!confirm(`Confirm start reservations processing`)) return;

        const doe: DOE = await performStartReservationsProcessing();

        alert(`Start reservations processing success!`);
    }

    // Rendering function
    // render start reservations processing action
    function renderStartReservationProcessingAction(): React.ReactNode{
        return (
            <div className='flex flex-col gap-4'>
                <p>Start reservations processing</p>
                <Button disabled={!authorizations.start_reservations_processing || srpLoading}
                    onClick={onStartReservationsProcessing}
                >
                    {
                        is_processing_shifts ? 'Processing' :
                        srpLoading ? <LoaderCircleIcon className='animate-spin' /> :
                        'Start'
                    }
                </Button>
            </div>
        )
    }

    return (
        <main className='flex flex-col gap-4'>

            <section className='flex flex-col gap-2'>
                { renderStartReservationProcessingAction() }
            </section>

        </main>
    )

}

export default DWAdminActionsWidget
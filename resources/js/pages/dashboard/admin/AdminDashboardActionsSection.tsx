import React, { useState } from 'react'
import { AdminDashboardPageData } from '../../../types/responsesTypes'
import { Button } from '../../../components/ui/button'
import { DOE } from '../../../types/common';
import { sendRequest } from '../../../helpers/requestHelper';
import { ADMIN_START_RESERVATIONS_PROCESSING_REQ } from '../../../requests/requests';
import AlertService from '../../../services/AlertService';

function AdminDashboardActionsSection({data}: {
    data: AdminDashboardPageData,
}) {
    const isProcessingShifts: boolean = Boolean(data.is_processing_shifts);
    const autoDropoffProcessingTime: string = String(data.auto_dropoff_processing_time);
    const autoPickupProcessingTime: string = String(data.auto_pickup_processing_time);
    const canStartReservationsProcessing: boolean = Boolean(data.authorizations?.start_reservations_processing);

    const [reservationsProcessingStarted, setReservationsProcessingStarted] = useState<boolean>(false);

    // actions
    async function onStartReservationsProcessing() {
        if(isProcessingShifts || reservationsProcessingStarted || !canStartReservationsProcessing) return;
        
        const doe: DOE = await sendRequest(ADMIN_START_RESERVATIONS_PROCESSING_REQ);
        setReservationsProcessingStarted(true);

        if(doe.error) {
            AlertService.showAlert({id: 0, text: `Error starting processing: ${doe.error.message}`});
        }
    }

    return (
        <main>

            {/* // Start shifts processing action */}
            <section className='flex flex-col gap-2'>
                <div className='flex gap-4 justify-between items-center'>
                    <p>Shifts processing</p>
                    <Button onClick={onStartReservationsProcessing} disabled={isProcessingShifts || reservationsProcessingStarted || !canStartReservationsProcessing}>
                        { isProcessingShifts ? "Processing" : "Start" }
                    </Button>
                </div>
                <div className='text-xs'>
                    <p>Dropoff auto processing time: {autoDropoffProcessingTime}</p>
                    <p>Pickup auto processing time: {autoPickupProcessingTime}</p>
                </div>
            </section>

        </main>
    )

}

export default AdminDashboardActionsSection
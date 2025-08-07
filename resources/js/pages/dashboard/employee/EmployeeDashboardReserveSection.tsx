import React from 'react'
import { EmployeeDashboardPageData } from '../../../types/responsesTypes'
import FormComp from '../../../components/common/formComp/FormComp'
import { DOE, HTTPRequest, JSONType } from '../../../types/common';
import { ReservationTypeEnum } from '../../../types/enums';
import { FormItemDef } from '../../../types/uiTypes';
import { EMPLOYEE_CANCEL_RESERVATION_REQ, EMPLOYEE_RESERVE_REQ } from '../../../requests/requests';
import { sendRequest } from '../../../helpers/requestHelper';
import AlertService from '../../../services/AlertService';

function EmployeeDashboardReserveSection({data}: {
    data: EmployeeDashboardPageData,
}) {
    const todaysReservations: JSONType[] | undefined = data.todaysReservations;
    const trajects: {id: number, label: string}[] | undefined = data.trajects;
    const allowedTimes = data.allowedTimes;
    if(!todaysReservations || !trajects || !allowedTimes) return <p>Invalid page response!</p>

    const todaysDropoffReservation: JSONType | null = todaysReservations[0];
    const todaysPickupReservation: JSONType | null = todaysReservations[1];

    // actions fns
    // get form items
    function getFormItems(reservationType: ReservationTypeEnum): FormItemDef[] {
        return [
            {name: "traject_id", displayName: "traject", type: "options", meta: {optionsData: trajects}},
            {name: "time", displayName: "time", type: "options", 
                meta: {optionsData: reservationType === ReservationTypeEnum.dropoff ? 
                    allowedTimes?.dropoff.map(val => ({id: val, label: val})) : 
                    allowedTimes?.pickup.map(val => ({id: val, label: val}))
                }
            },
        ];
    }

    // on reserve
    async function onReserve(reservationType: ReservationTypeEnum, json: JSONType): Promise<DOE> {
        const request: HTTPRequest = EMPLOYEE_RESERVE_REQ;
        
        const doe: DOE = await sendRequest(request, {type: reservationType, ...json});

        if(doe.error) {
            AlertService.showAlert({id: 0, text: doe.error.message ?? "Error reserving!", severity: "error"});
        }else {
            AlertService.showAlert({id: 0, text: "Reservation done!"});
        }

        return doe;
    }

    // on cancel reservation
    async function onCancelReservation(reservationType: ReservationTypeEnum, json: JSONType): Promise<DOE> {
        const request: HTTPRequest = EMPLOYEE_CANCEL_RESERVATION_REQ;
        
        const doe: DOE = await sendRequest(request, {type: reservationType, ...json});

        if(doe.error) {
            AlertService.showAlert({id: 0, text: doe.error.message ?? "Error canceling reserving!", severity: "error"});
        }else {
            AlertService.showAlert({id: 0, text: "Reservation canceled!"});
        }

        return doe;
    }

    // render fns
    // render reserve "reservations"
    function renderReservation(reservationType: ReservationTypeEnum): React.ReactNode {
        const isReservationMade: boolean = reservationType === ReservationTypeEnum.dropoff ?
            todaysDropoffReservation != null :
            todaysPickupReservation != null;

        const authorization: boolean | undefined = !isReservationMade ? ( // of reservation not made, choose reserve authorization
            reservationType === ReservationTypeEnum.dropoff ?
            data.authorizations?.reserve_dropoff :
            data.authorizations?.reserve_pickup
        ) : ( // if already made, choose cancel authorization
            reservationType === ReservationTypeEnum.dropoff ?
            data.authorizations?.cancel_dropoff :
            data.authorizations?.cancel_pickup
        );

        return (
            <FormComp
                formDef={{
                    id: `employee_reserve_${reservationType}`,
                    title: isReservationMade ? `Cancel ${reservationType} reservation` : `Reserve ${reservationType}`,
                    items: getFormItems(reservationType),
                    action: {
                        name:isReservationMade ? "cancel" : "reserve",
                        displayName: isReservationMade ? "Cancel" : "Reserve",
                        onValidatedData: (json: JSONType)=> isReservationMade ? onCancelReservation(reservationType, json) : onReserve(reservationType, json),
                        authorization: authorization,
                        oneTimePerPageLoad: true,
                    },
                }}
                data={
                    reservationType === ReservationTypeEnum.dropoff ? 
                    (todaysDropoffReservation ?? undefined) : 
                    (todaysPickupReservation ?? undefined)
                }
            />
        )
    }

    // render reserved details (for reserved shifts, show other details(status, shift number if exists))
    function renderReservedDetails(reservationData: JSONType): React.ReactNode {
        if(!reservationData) return null;

        return (
            <ul className='flex p-2 gap-4 items-center border text-sm'>
                <li className='flex items-center gap-2'>
                    <p className='font-semibold'>Status: </p>
                    <p>{reservationData["status"]}</p>
                </li>
                <li>|</li>
                <li className='flex items-center gap-2'>
                    <p className='font-semibold'>Shift number: </p>
                    <p>{reservationData["labels"]["shift"] ?? "N/A"}</p>
                </li>
            </ul>
        )
    }

    return (
        <>
            { renderReservedDetails(todaysDropoffReservation) }
            { renderReservation(ReservationTypeEnum.dropoff) }

            <hr />

            { renderReservedDetails(todaysPickupReservation) }
            { renderReservation(ReservationTypeEnum.pickup) }
        </>
    )

}

export default EmployeeDashboardReserveSection
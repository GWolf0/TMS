import FormComp from '@/components/common/FormComp';
import { sendRequest } from '@/helpers/requestHelper';
import { EMPLOYEE_CANCEL_RESERVATION_REQ, EMPLOYEE_RESERVE_REQ } from '@/requests/requests';
import AlertService from '@/services/AlertService';
import { DOE, JSONType } from '@/types/common'
import { ReservationTypeEnum } from '@/types/enums';
import { RESERVATION_FORM_ITEMS } from '@/types/models';
import React, { useMemo } from 'react'

function DWEmployeeReserveWidget({todaysReservations, authorizations}: {
    todaysReservations?: JSONType[],authorizations?: { 
        reserve_dropoff: boolean,
        reserve_pickup: boolean,
    },
}) {
    if(!todaysReservations) return "null";

    const dropoffReservation = useMemo(() => todaysReservations.find(r => r["type"] == ReservationTypeEnum.dropoff), [todaysReservations]);
    const pickupReservation = useMemo(() => todaysReservations.find(r => r["type"] == ReservationTypeEnum.pickup), [todaysReservations]);

    // actions
    async function onReserve(validatedData: JSONType, type: ReservationTypeEnum): Promise<DOE> {
        const doe: DOE = await sendRequest(EMPLOYEE_RESERVE_REQ, validatedData);
        
        if(doe.error){
            AlertService.showAlert({id: -1, text: `Error reserving!`, severity: "error"});
        }else{
            AlertService.showAlert({id: -1, text: `Reservations sent successfuly!`});
        }

        return doe;
    }

    async function onCancelReservation(validatedData: JSONType, type: ReservationTypeEnum): Promise<DOE> {
        const doe: DOE = await sendRequest(EMPLOYEE_CANCEL_RESERVATION_REQ, validatedData);
        
        if(doe.error){
            AlertService.showAlert({id: -1, text: `Error calceling reservation!`, severity: "error"});
        }else{
            AlertService.showAlert({id: -1, text: `Reservations canceled successfuly!`});
        }

        return doe;
    }

    // rendering functions
    // render dropoff form
    function renderReservationForm(type: ReservationTypeEnum): React.ReactNode{
        const authorization: boolean = Boolean(type === ReservationTypeEnum.dropoff ?
            authorizations?.reserve_dropoff : authorizations?.reserve_pickup);

        return (
            <FormComp 
                formDef={{
                    id: `${type}_reserve`,
                    title: `Reserve ${type}`,
                    items: [
                        {name: "type", type: "hidden", meta: {hiddenVal: type}},
                        ...RESERVATION_FORM_ITEMS.filter(f => ["traject_id", "date", "time"].includes(f.name)),
                    ],
                    action: !dropoffReservation ?
                    {
                        name: `reserve_${type}`, displayName: `Reserve ${type}`, authorized: authorization,
                        onValidatedData: (data) => onReserve(data, type),
                    } : {
                        name: `cancel_${type}`, displayName: `Cancel ${type}`, authorized: authorization,
                        onValidatedData: (data) => onCancelReservation(data, type),
                    },
                }}
                data={type === ReservationTypeEnum.dropoff ? dropoffReservation : pickupReservation}
            />
        )
    }

    return (
        <main>

            {/* // dropoff form section */}
            <section>
                { renderReservationForm(ReservationTypeEnum.dropoff) }
            </section>

            {/* // pickup form section */}
            <section>
                { renderReservationForm(ReservationTypeEnum.pickup) }
            </section>

        </main>
    )

}

export default DWEmployeeReserveWidget
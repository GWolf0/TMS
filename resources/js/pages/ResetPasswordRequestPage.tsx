import ErrorComp from '@/components/common/ErrorComp';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useFetch from '@/hooks/useFetch'
import { SEND_PWD_RESET_EMAIL_REQ } from '@/requests/requests';
import AlertService from '@/services/AlertService';
import { DOE } from '@/types/common';
import { LoaderCircle } from 'lucide-react';
import React, { useState } from 'react'

// Page contains form to send password request to specific email
function ResetPasswordRequestPage() {

    // states
    const [performed, setPerformed] = useState<boolean>(false);

    // fetch hooks
    const [performPWDResetRequest, pwdResetRequestLoading, pwdResetRequestDoe] = useFetch(SEND_PWD_RESET_EMAIL_REQ);

    // actions
    async function onPWDResetRequest(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(pwdResetRequestLoading || performed) return;

        const fd: FormData = new FormData(e.currentTarget);

        const email: string = fd.get("email")!.toString();

        const doe: DOE = await performPWDResetRequest({email});

        setPerformed(true);

        if(doe.error){
            AlertService.showAlert({id: -1, text: `Error sending password reset request email!`, severity: "error"});
        }else{
            AlertService.showAlert({id: -1, text: `Password reset request email send successfuly!`});
        }
    }

    // Render functions
    // render password reset request form
    function renderPWDResetRequestForm(): React.ReactNode{
        return (
            <form className='flex flex-col gap-4' onSubmit={onPWDResetRequest}>
                <ErrorComp error={pwdResetRequestDoe?.error} />

                <div className='flex flex-col gap-2'>
                    <Input type='email' required name="email" className='text-center' placeholder='email' />
                </div>

                <div className='flex items-center justify-end'>
                    <Button type='submit' disabled={pwdResetRequestLoading || performed}>
                        { pwdResetRequestLoading ? <LoaderCircle className='animate-spin' /> : <p>Send</p> }
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <main>
            <p className='mb-8'>Send password reset email</p>

            { renderPWDResetRequestForm() }
        </main>
    )

}

export default ResetPasswordRequestPage
import { LoaderCircle } from 'lucide-react';
import React, { useState } from 'react'
import ErrorComp from '../components/common/ErrorComp';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import useRequest from '../hooks/useRequest';
import { SEND_PWD_RESET_EMAIL_REQ } from '../requests/requests';
import AlertService from '../services/AlertService';
import { DOE } from '../types/common';
import MainLayout from '../layouts/MainLayout';

// Page contains form to send password request to specific email
function ResetPasswordRequestPage() {

    // states
    const [performed, setPerformed] = useState<boolean>(false);

    // fetch hooks
    const [performPWDResetRequest, pwdResetRequestLoading, pwdResetRequestDoe] = useRequest(SEND_PWD_RESET_EMAIL_REQ);

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
            AlertService.showAlert({id: -1, text: `Password reset request email sent successfuly!`});
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
                        { pwdResetRequestLoading ? <LoaderCircle className='animate-spin' /> : <p>Send Reset Link To Email</p> }
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <MainLayout>

            <main>
                <p className='mb-8 underline'>Send password reset email</p>

                { renderPWDResetRequestForm() }
            </main>

        </MainLayout>
    )

}

export default ResetPasswordRequestPage
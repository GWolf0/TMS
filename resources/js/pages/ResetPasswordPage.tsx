import ErrorComp from '@/components/common/ErrorComp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useFetch from '@/hooks/useFetch';
import { RESET_PWD_REQ } from '@/requests/requests';
import AlertService from '@/services/AlertService';
import { DOE, JSONType } from '@/types/common';
import { LoaderCircle } from 'lucide-react';
import React, { useState } from 'react'

// Page contains form to reset password (typically triggered by reset password link from user email)
function ResetPasswordPage() {
    
    // states
    const [performed, setPerformed] = useState<boolean>(false);

    // fetch hooks
    const [performPWDReset, pwdResetLoading, pwdResetDoe] = useFetch(RESET_PWD_REQ);

    // actions
    async function onPWDReset(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(pwdResetLoading || performed) return;

        const fd: FormData = new FormData(e.currentTarget);

        const email: string = fd.get("email")!.toString();
        const password: string = fd.get("password")!.toString();
        const password_confirmation: string = fd.get("password_confirmation")!.toString();
        const token: string = fd.get("token")!.toString();

        const doe: DOE = await performPWDReset({email, password, password_confirmation, token});

        setPerformed(true);

        if(doe.error){
            AlertService.showAlert({id: -1, text: `Error resetubg password!`, severity: "error"});
        }else{
            AlertService.showAlert({id: -1, text: `Password reset successfuly!`});
        }
    }

    // helpers
    // get token
    function getToken(): string | undefined{
        const segments: string[] = location.pathname.split("/").filter(s => Boolean(s));
        return segments[1];
    }

    // Render functions
    // render password reset request form
    function renderPWDResetForm(): React.ReactNode{
        return (
            <form className='flex flex-col gap-4' onSubmit={onPWDReset}>
                <ErrorComp error={pwdResetDoe?.error} />

                <div className='flex flex-col gap-2'>
                    <Input type='email' required name="email" className='text-center' placeholder='email' />
                    <Input type='password' required name="password" className='text-center' placeholder='new password' />
                    <Input type='password' required name="password_confirmation" className='text-center' placeholder='confirm new password' />
                    <Input type='hidden' name="token" value={getToken()} />
                </div>

                <div className='flex items-center justify-end'>
                    <Button type='submit' disabled={pwdResetLoading || performed}>
                        { pwdResetLoading ? <LoaderCircle className='animate-spin' /> : <p>Reset</p> }
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <main>
            <p className='mb-8'>Reset password</p>

            { renderPWDResetForm() }
        </main>
    )

}

export default ResetPasswordPage
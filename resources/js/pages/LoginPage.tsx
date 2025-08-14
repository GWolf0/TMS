import { Head, usePage } from '@inertiajs/react';
import { LoaderCircleIcon } from 'lucide-react';
import React from 'react'
import { z } from "zod";
import { SharedData } from '../types';
import useRequest from '../hooks/useRequest';
import ErrorComp from '../components/common/ErrorComp';
import Logo from '../components/common/Logo';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MainLayout from '../layouts/MainLayout';
import { LOGIN_REQ } from '../requests/requests';
import AlertService from '../services/AlertService';
import { DOE } from '../types/common';
import { formatZodError } from '../helpers/zodHelper';

// Login page
function LoginPage() {
    const {auth, name} = usePage<SharedData>().props;

    if(auth.user) return null;

    const [fetchLogin, fetchLoginLoading, fetchLoginDoe] = useRequest(LOGIN_REQ);

    // On login
    async function onLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const fd = new FormData(e.currentTarget);
        const params = Object.fromEntries(fd);

        const validationObj = z.object({
            email: z.string().email(),
            password: z.string().min(8).max(24),
            remember_me: z.boolean({coerce: true}).optional(),
        });

        const validation = validationObj.safeParse(params);
        
        if(validation.success){
            const doe: DOE = await fetchLogin(validation.data);
            if(doe.error){
                AlertService.showAlert({id: -1, text: `Error Login: ${doe.error.message}`});
            }
        }else{
            AlertService.showAlert({id: -1, text: `Error Login: ${formatZodError(validation.error)}`});
        }
    }

    return (
    <>
        <Head title="Login" />
        
        <MainLayout pageName='login'>

            {/* // Login box */}
            <section className='w-full mt-20'>

                <div className='mx-auto flex flex-col gap-8 md:border px-4 py-16 rounded' style={{width: 'min(100%, 480px)'}}>
                    {/* // Logo */}
                    <div className='flex items-center justify-center py-4'>
                        <Logo width={128} noText />
                    </div>

                    {/* // Login Form */}
                    <form className='w-full flex flex-col gap-4' onSubmit={onLogin}>
                        {/* // main error message if exists */}
                        <ErrorComp error={fetchLoginDoe?.error} />

                        {/* // Inputs */}
                        <div className='flex flex-col gap-2'>
                            {/* // email */}
                            <Input className='text-center' name="email" type='email' placeholder='email' required />
                            {/* // password */}
                            <Input className='text-center' name="password" type='password' placeholder='password' required />

                            {/* // remember */}
                            <Input type="hidden" name="remember_me" defaultValue={"true"} />
                        </div>

                        {/* // Buttons */}
                        <div className=''>
                            <Button className='w-full tracking-wider' type='submit' disabled={fetchLoginLoading}>
                                { fetchLoginLoading ? <LoaderCircleIcon className='animate-spin' /> : "Login" }
                            </Button>
                        </div>

                    </form>

                    {/* // Extra actions */}
                    <div className=' flex flex-col gap-1 items-center justify-center'>
                        <Button variant={"link"} asChild>
                            <a href="/reset-password-request">Request password reset</a>
                        </Button>
                    </div>

                </div>

            </section>

        </MainLayout>
    </>
    )

}

export default LoginPage
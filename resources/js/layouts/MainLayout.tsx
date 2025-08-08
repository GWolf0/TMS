import { usePage } from '@inertiajs/react'
import React, { ReactNode } from 'react'
import { SharedData } from '../types';
import BaseLayout from '../components/common/BaseLayout';
import { BaseHeader, BaseFooter } from '../components/common/BaseHeaderAndFooter';
import { Button } from '../components/ui/button';
import Logo from '../components/common/Logo';
import useRequest from '../hooks/useRequest';
import { LOGOUT_REQ } from '../requests/requests';

function MainLayout({children}: {
    children: ReactNode,
}) {
    const {auth, name} = usePage<SharedData>().props;

    // fetch logout
    const [handleLogout, logoutIsLoading, logoutDoe] = useRequest(LOGOUT_REQ);

    function onLogout(){
        handleLogout();
    }

    return (
        <BaseLayout
            header={
                <BaseHeader 
                    logo={<Logo linkToHome={true} />}
                    items={auth.user ? [
                        <div className='flex flex-col gap-0.5 items-end'>
                            <p className='text-xs md:text-sm'>Welcome {auth.user.name}</p>
                            <Button variant={"link"} size={"sm"} className='text-xs text-destructive' onClick={onLogout} disabled={logoutIsLoading}>
                                Logout
                            </Button>
                        </div>
                    ]:[
                        <Button asChild><a href='/login'>Login</a></Button>
                    ]}
                />
            }
            footer={
                <BaseFooter 
                    appName={name}
                    items={[
                        {name: "About", link: "#"},
                        {name: "Contact", link: "#"},
                        {name: "Privacy Policy", link: "#"},
                        {name: "Placeholder", link: "#"},
                    ]}
                />
            }
        >

            {children}
            
        </BaseLayout>
    )

}

export default MainLayout
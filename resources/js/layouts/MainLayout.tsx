import { BaseFooter, BaseHeader } from '@/components/common/BaseHeaderAndFooter'
import BaseLayout from '@/components/common/BaseLayout'
import Logo from '@/components/common/Logo'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/useFetch'
import { LOGOUT_REQ } from '@/requests/requests'
import { SharedData } from '@/types'
import { usePage } from '@inertiajs/react'
import React, { ReactNode } from 'react'

function MainLayout({children}: {
    children: ReactNode,
}) {
    const {auth, name} = usePage<SharedData>().props;

    // fetch logout
    const [handleLogout, logoutIsLoading, logoutDoe] = useFetch(LOGOUT_REQ);

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
                        <Button>Login</Button>
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
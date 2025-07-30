import React, { ReactNode } from 'react'
import { ModalsComp } from './BaseModals';
import AlertComp, { AlertsComp } from './AlertComp';

function BaseLayout({header, footer, children, maxWidth}: {
    header?: ReactNode, footer?: ReactNode, children: ReactNode, maxWidth?: number,
}) {
    maxWidth = maxWidth || 1280;

    return (
        <div className='w-full'>
            {header}

            <div className='mx-auto py-10 px-2 md:px-4 min-h-screen' style={{width: `min(100%, ${maxWidth}px)`}}>
                <AlertsComp />

                {children}

                {/* // modals box */}
                <ModalsComp />

            </div>

            {footer}
        </div>
    )

}

export default BaseLayout
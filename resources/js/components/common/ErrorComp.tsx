import { MError } from '@/types/common'
import React from 'react'

// If error is defined, display error message or specific error message by key if present
function ErrorComp({error, errorKey}: {
    error?: MError, errorKey?: string,
}) {
    if(!error) return null;

    function renderError(text: string){
        return (
            <p className='text-destructive-foreground bg-destructive p-4 text-sm my-2 rounded'>{text}</p>
        )
    }

    // keyed error
    if(errorKey && error.errors && Object.hasOwn(error.errors, errorKey)) return renderError(error.errors[errorKey]);

    if(error.message) return renderError(error.message);

}

export default ErrorComp
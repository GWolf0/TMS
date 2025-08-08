import React from 'react'
import { APP_NAME } from '../../constants/constants';

const LOGO_PATH = "/logo.svg";

function Logo({linkToHome, width, noText}: {
    linkToHome?: boolean, width?: number, noText?: boolean,
}) {
    width = width || 36;

    function renderLogo(){
        return (
            <div className='flex items-center gap-2'>
                <img src={LOGO_PATH} alt="logo" width={width} className='rounded-lg' />
                { renderLogoText() }
            </div>
        )
    }

    function withLinkToHome(){
        return (
            <a href="/">
                {renderLogo()}
            </a>
        )
    }

    function renderLogoText() {
        if(noText) return null;
        return <p className='hidden md:block font-bold text-lg' style={{color: "#ff6900"}}>{APP_NAME}</p>
    }

    return linkToHome ? withLinkToHome() : renderLogo();

}

export default Logo
import React from 'react'

const LOGO_PATH = "/logo.svg";

function Logo({linkToHome, width}: {
    linkToHome?: boolean, width?: number,
}) {
    width = width || 60;

    function renderLogo(){
        return (
            <img src={LOGO_PATH} alt="logo" width={width} />
        )
    }

    function withLinkToHome(){
        return (
            <a href="/">
                {renderLogo()}
            </a>
        )
    }

    return linkToHome ? withLinkToHome() : renderLogo();

}

export default Logo
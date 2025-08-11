import React from 'react'
import { __, getLocale } from '../helpers/localizationHelper'
import { JSONType } from '../types/common';

function useLocal(): 
[locale: string, localize: (text: string, params: JSONType | undefined) => any] {
    const locale: string = getLocale();

    function localize(text: string, params: JSONType | undefined = undefined): string {
        return __(text, params, locale);
    }

    return [locale, localize];

}

export default useLocal
import React, { useMemo, useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { SUPPORTED_LANGS } from '../../langs';
import { DOE } from '../../types/common';
import { sendRequest } from '../../helpers/requestHelper';
import { MISC_SET_LOCALE_REQ } from '../../requests/requests';

function LangSelect() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function onValueChange(value: string) {
        setLocale(value);
    }

    async function setLocale(locale: string) {
        if(isLoading) return;
        setIsLoading(true);

        const doe: DOE = await sendRequest(MISC_SET_LOCALE_REQ, {locale});

        if(doe.error) {
            alert(`Error setting locale!`);
        } else {
            location.reload();
        }

        setIsLoading(false);
    }

    return (
        <Select onValueChange={onValueChange} disabled={isLoading}>
            <SelectTrigger className="min-w-[100px]">
                <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent>
                {
                    SUPPORTED_LANGS.map((lang, i) => (
                        <SelectItem key={i} value={lang}>
                            <p>{lang}</p>
                        </SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )

}

export default LangSelect
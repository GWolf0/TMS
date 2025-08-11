import { SUPPORTED_LANGS, LANGS_DATA } from "../langs";
import { JSONType } from "../types/common";

/**
 * Gets the current locale from localStorage or sets a default.
 */
export function getLocale(defaultValue: string = "en"): string {
    // const saved = localStorage.getItem("locale");
    // if (saved != null) return saved;

    // localStorage.setItem("locale", defaultValue.toString());
    // return defaultValue.toString();
    const lang = document.querySelector("html")?.getAttribute("lang");
    return lang ?? defaultValue;
}

/**
 * Translates a string using the current locale and interpolates parameters.
 */
export function __(
    text: string,
    params: JSONType | undefined = undefined,
    locale: string
): string {
    const data: string | undefined = LANGS_DATA[locale]?.[text];
    const template = data || text;
    return interpolateString(template, params);
}

/**
 * Replaces placeholders in the form {key} with values from params.
 */
function interpolateString(text: string, params: JSONType | undefined): string {
    if (!params) return text;

    return text.replace(/{(.*?)}/g, (_, key) => {
        const value = params[key.trim()];
        return value !== undefined ? String(value) : `{${key}}`;
    });
}

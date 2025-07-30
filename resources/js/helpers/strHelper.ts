// helpers for string

// capitalize
export function strCapitalize(str: string): string{
    if(str.length < 1) return str;
    return str[0].toUpperCase() + str.substring(1);
}

// strip underscores
export function strStripUnderscores(str: string): string { return str.replaceAll("_", " "); }

// pluralize
export function strPluralize(str: string): string {
    if(str.endsWith("s")) return str;
    return str + "s";
}
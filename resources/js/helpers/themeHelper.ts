export type AppTheme = "dark" | "light" | "auto";

export function getTheme(defaultValue: AppTheme): AppTheme{
    const saved = localStorage.getItem("theme");
    if (saved != null) return saved as AppTheme;

    localStorage.setItem("theme", defaultValue.toString());
    return defaultValue;
}

export function setTheme(value: AppTheme) {
    if(value === "auto") value = getAutoValue();

    localStorage.setItem("theme", value);
    
    if(value === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
}

export function getAutoValue(): AppTheme {
    if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return "dark";
    return "light";
}

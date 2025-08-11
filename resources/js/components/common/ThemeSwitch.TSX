import React, { useMemo } from 'react'
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { getTheme, setTheme } from '../../helpers/themeHelper';

function ThemeSwitch() {
  const isDarkMode: boolean = useMemo(() => getTheme("auto") === "dark", []);

  function onCheckedChange(checked: boolean) {
    setTheme(checked ? "dark" : "light");
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch id="theme" onCheckedChange={onCheckedChange} checked={isDarkMode} />
      <Label htmlFor="theme" className='text-xs'>Dark Mode</Label>
    </div>
  )

}

export default ThemeSwitch
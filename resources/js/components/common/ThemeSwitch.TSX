import React, { useEffect, useMemo, useState } from 'react'
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { getTheme, setTheme } from '../../helpers/themeHelper';

function ThemeSwitch() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => getTheme("auto") === "dark");

  useEffect(() => {
    const newVal = isDarkMode ? "dark" : "light";
    setTheme(newVal);
  }, [isDarkMode]);

  function onCheckedChange(checked: boolean) {
    setIsDarkMode(checked);
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch id="theme" onCheckedChange={onCheckedChange} checked={isDarkMode} />
      <Label htmlFor="theme" className='text-xs'>Dark Mode</Label>
    </div>
  )

}

export default ThemeSwitch
"use client";
import { Moon, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // This code runs only on the client side
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
    }
  }, []);

  // update state on toggle
  const handleToggle = (e: any) => {
    if (e.target.checked) {
      setTheme("night");
    } else {
      setTheme("light");
    }
  };

  // set theme state in localstorage on mount & also update localstorage on state change
  useEffect(() => {
    localStorage.setItem("theme", theme!);
    const localTheme = localStorage.getItem("theme");
    // add custom data-theme attribute to html tag required to update theme using DaisyUI
    document.querySelector("html")!.setAttribute("data-theme", localTheme!);
  }, [theme]);

  return (
    <label className="hover:scale-110 transition duration-200 ease-in-out md:hover:scale-100 swap swap-rotate">
      {/* this hidden checkbox controls the state */}
      <input
        onChange={handleToggle}
        type="checkbox"
        checked={theme === "light" ? false : true}
      />
      {/* moon icon */}
      <Moon className="swap-off w-6 h-6 fill-base-content" />
      {/* sun icon */}
      <SunMedium className="swap-on w-6 h-6 fill-base-content" />
    </label>
  );
};

export default ThemeSwitcher;

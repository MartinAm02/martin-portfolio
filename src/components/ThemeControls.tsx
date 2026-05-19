"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/data";

export type ThemeMode = "dark" | "light";

type ThemeLabels = {
  languageLabel: string;
  themeLabel: string;
};

type ThemeControlsProps = {
  labels: ThemeLabels;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  mobile?: boolean;
};

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme-mode");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.dataset.theme = stored;
      return;
    }

    document.documentElement.dataset.theme = "dark";
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme-mode", theme);
  }, [theme]);

  return { setTheme, theme };
}

export function ThemeControls({ labels, locale, mobile = false, setLocale }: ThemeControlsProps) {
  const { setTheme, theme } = useThemeMode();
  const className = mobile ? "mlb" : "lb";

  return (
    <div className="control-cluster">
      <div className={mobile ? "m-lang" : "lang"} aria-label={labels.languageLabel}>
        <button className={`${className} ${locale === "es" ? "on" : ""}`} onClick={() => setLocale("es")} type="button">
          ES
        </button>
        <button className={`${className} ${locale === "en" ? "on" : ""}`} onClick={() => setLocale("en")} type="button">
          EN
        </button>
      </div>
      <button
        aria-label={labels.themeLabel}
        className="theme-toggle"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        type="button"
      >
        {theme === "dark" ? "☾" : "☀"}
      </button>
    </div>
  );
}

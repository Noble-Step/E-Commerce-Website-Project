import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

// Theme Provider
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });

  const [accentColor, setAccentColor] = useState(() => {
    const saved = localStorage.getItem("accentColor");
    return saved || "yellow";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    localStorage.setItem("accentColor", accentColor);
  }, [isDarkMode, accentColor]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const changeAccentColor = (color) => {
    setAccentColor(color);
  };

  const themeClasses = {
    background: isDarkMode ? "bg-black" : "bg-white",
    text: isDarkMode ? "text-white" : "text-black",
    accent: `text-${accentColor}-400`,
    border: `border-${accentColor}-500`,
    hover: `hover:bg-${accentColor}-500`,
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        accentColor,
        toggleDarkMode,
        changeAccentColor,
        themeClasses,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

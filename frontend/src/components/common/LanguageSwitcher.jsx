import React, { useState, useRef, useEffect } from "react";
import { Globe2, Check } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import "./LanguageSwitcher.css";

export default function LanguageSwitcher({ compact = false }) {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const activeLangObj =
    availableLanguages.find((l) => l.code === currentLanguage) ||
    availableLanguages[0];

  return (
    <div className={`eduspark-lang-switcher-wrap ${compact ? "compact" : ""}`} ref={dropdownRef}>
      <button
        type="button"
        className="eduspark-lang-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
        title="Change application language"
      >
        <Globe2 size={16} className="lang-globe-icon" />
        <span className="lang-label">{activeLangObj.native}</span>
        <span className="lang-arrow" aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <ul
          className="eduspark-lang-dropdown"
          role="listbox"
          aria-label="Language options"
        >
          {availableLanguages.map((lang) => {
            const isSelected = lang.code === currentLanguage;
            return (
              <li
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                className={`lang-option ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }
                }}
              >
                <span className="lang-native-name">{lang.native}</span>
                <span className="lang-english-name">({lang.label})</span>
                {isSelected && <Check size={14} className="lang-check-icon" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

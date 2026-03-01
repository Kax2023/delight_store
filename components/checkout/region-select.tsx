"use client";

import * as React from "react";
import { useRef, useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MAINLAND_REGIONS = [
  "Arusha",
  "Dar es Salaam",
  "Dodoma",
  "Geita",
  "Iringa",
  "Kagera",
  "Katavi",
  "Kigoma",
  "Kilimanjaro",
  "Lindi",
  "Manyara",
  "Mara",
  "Mbeya",
  "Morogoro",
  "Mtwara",
  "Mwanza",
  "Njombe",
  "Pwani",
  "Rukwa",
  "Ruvuma",
  "Shinyanga",
  "Simiyu",
  "Singida",
  "Songwe",
  "Tabora",
  "Tanga",
];

const ZANZIBAR_REGIONS = [
  { value: "Kaskazini Unguja", label: "Kaskazini Unguja (North Unguja)" },
  { value: "Kusini Unguja", label: "Kusini Unguja (South Unguja)" },
  { value: "Mjini Magharibi", label: "Mjini Magharibi (Urban West)" },
  { value: "Kaskazini Pemba", label: "Kaskazini Pemba (North Pemba)" },
  { value: "Kusini Pemba", label: "Kusini Pemba (South Pemba)" },
];

const PLACEHOLDER = "Choose your region";

export interface RegionSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function RegionSelect({
  id = "region",
  value,
  onChange,
  required = false,
  disabled = false,
  className,
  "aria-label": ariaLabel = "Select region",
}: RegionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const allOptions = [
    ...MAINLAND_REGIONS.map((r) => ({ value: r, label: r, group: "mainland" })),
    ...ZANZIBAR_REGIONS.map((r) => ({ ...r, group: "zanzibar" })),
  ];
  const flatOptions = allOptions;

  const getDisplayValue = () => {
    if (!value) return PLACEHOLDER;
    const found = ZANZIBAR_REGIONS.find((r) => r.value === value);
    return found ? found.label : value;
  };

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  const selectOption = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      closeDropdown();
    },
    [onChange, closeDropdown]
  );

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && flatOptions[highlightedIndex]) {
            selectOption(flatOptions[highlightedIndex].value);
          }
        } else {
          setIsOpen(true);
          setHighlightedIndex(value ? flatOptions.findIndex((o) => o.value === value) : 0);
        }
        break;
      case "Escape":
        e.preventDefault();
        closeDropdown();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex((prev) =>
            prev < flatOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : flatOptions.length - 1
          );
        }
        break;
      case "Tab":
        if (isOpen) closeDropdown();
        break;
    }
  };

  // Scroll highlighted item into view (account for group headers in DOM)
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const domIndex =
        highlightedIndex < MAINLAND_REGIONS.length
          ? highlightedIndex + 1
          : highlightedIndex + 2;
      const item = listboxRef.current.children[domIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isOpen, highlightedIndex]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Hidden input for form validation */}
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={() => {}}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0 pointer-events-none"
        style={{ position: "absolute", left: "-9999px" }}
      />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => {
          if (disabled) return;
          const nextOpen = !isOpen;
          setIsOpen(nextOpen);
          if (nextOpen) {
            setHighlightedIndex(
              value ? flatOptions.findIndex((o) => o.value === value) : 0
            );
          }
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        aria-labelledby={`${id}-label`}
        aria-activedescendant={
          isOpen && highlightedIndex >= 0
            ? `${id}-option-${highlightedIndex}`
            : undefined
        }
        className={cn(
          "flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-left text-sm outline-none transition-all duration-200",
          "min-h-11 touch-manipulation sm:min-h-10 sm:rounded-2xl",
          "hover:border-slate-300 hover:bg-slate-50/50",
          "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-white",
          "dark:border-white/10 dark:bg-slate-800 dark:text-white dark:hover:border-white/20 dark:hover:bg-slate-700/50 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20",
          isOpen && "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400 dark:ring-emerald-400/20"
        )}
      >
        <span
          className={cn(
            "truncate",
            !value && "text-slate-500 dark:text-slate-400"
          )}
        >
          {getDisplayValue()}
        </span>
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 shrink-0 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180 text-emerald-500 dark:text-emerald-400"
          )}
          aria-hidden
        />
      </button>

      {/* Dropdown panel - fade + slide */}
      <div
        role="presentation"
        className={cn(
          "absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden",
          "rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-slate-800",
          "transition-all duration-200 ease-out motion-reduce:transition-none",
          isOpen
            ? "translate-y-0 opacity-100 visible"
            : "-translate-y-2 opacity-0 invisible pointer-events-none"
        )}
      >
        <ul
          ref={listboxRef}
          role="listbox"
          aria-label={ariaLabel}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined
          }
          tabIndex={-1}
          className="max-h-60 overflow-y-auto py-2 sm:max-h-72"
        >
          {/* Mainland group */}
          <li
            role="group"
            aria-label="Mainland Tanzania"
            className="px-4 py-2"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mainland Tanzania
            </span>
          </li>
          {MAINLAND_REGIONS.map((region, idx) => {
            const flatIdx = idx;
            const isHighlighted = highlightedIndex === flatIdx;
            const isSelected = value === region;
            return (
              <li
                key={region}
                id={`${id}-option-${flatIdx}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(region)}
                onMouseEnter={() => setHighlightedIndex(flatIdx)}
                className={cn(
                  "cursor-pointer px-4 py-3 text-sm transition-colors duration-150 rounded-xl mx-2 sm:py-2.5 sm:rounded-lg",
                  "hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-200",
                  isHighlighted &&
                    "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
                  isSelected &&
                    "bg-emerald-100 font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-100"
                )}
              >
                {region}
              </li>
            );
          })}
          {/* Zanzibar group */}
          <li
            role="group"
            aria-label="Zanzibar"
            className="px-4 py-2 mt-1"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Zanzibar
            </span>
          </li>
          {ZANZIBAR_REGIONS.map((region, idx) => {
            const flatIdx = MAINLAND_REGIONS.length + idx;
            const isHighlighted = highlightedIndex === flatIdx;
            const isSelected = value === region.value;
            return (
              <li
                key={region.value}
                id={`${id}-option-${flatIdx}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => selectOption(region.value)}
                onMouseEnter={() => setHighlightedIndex(flatIdx)}
                className={cn(
                  "cursor-pointer px-4 py-3 text-sm transition-colors duration-150 rounded-xl mx-2 sm:py-2.5 sm:rounded-lg",
                  "hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-200",
                  isHighlighted &&
                    "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
                  isSelected &&
                    "bg-emerald-100 font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-100"
                )}
              >
                {region.label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

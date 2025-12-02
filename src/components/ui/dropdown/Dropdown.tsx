import type React from "react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  usePortal?: boolean;
  anchorRect?: DOMRect | null;
  placement?: "right" | "bottom";
  offset?: number;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  usePortal = true,
  anchorRect,
  placement = "right",
  offset = 8,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".dropdown-toggle")
      ) {
        onClose();
      }
    };

    const handleDismiss = () => onClose();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleDismiss, true);
    window.addEventListener("resize", handleDismiss, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleDismiss, true);
      window.removeEventListener("resize", handleDismiss, true);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const content = (
    <div
      ref={dropdownRef}
      className={`rounded-xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${className}`}
    >
      {children}
    </div>
  );

  if (!usePortal || !anchorRect) {
    return (
      <div className="absolute z-40 right-0 mt-2">
        {content}
      </div>
    );
  }

  const top =
    placement === "bottom"
      ? Math.round((anchorRect.bottom + offset) + window.scrollY)
      : Math.round((anchorRect.top + window.scrollY));
  const left =
    placement === "bottom"
      ? Math.round(anchorRect.left)
      : Math.round(anchorRect.right + offset);

  return createPortal(
    <div
      style={{ position: "fixed", top, left, zIndex: 1000 }}
      className=""
    >
      {content}
    </div>,
    document.body
  );
};

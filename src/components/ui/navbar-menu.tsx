"use client";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface MenuItemProps {
  label: string;
  href?: string;
  children?: React.ReactNode;
}

export const NavDropdown = ({ label, href, children }: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {href ? (
        <Link
          to={href}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          {label}
        </Link>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors",
            isOpen && "text-white"
          )}
        >
          {label}
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      )}
      
      {children && isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-56">
          <div className="bg-black/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-2">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
};

export const DropdownItem = ({ to, children, onClick }: { to?: string; children: React.ReactNode; onClick?: () => void }) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  if (to) {
    return (
      <Link
        to={to}
        onClick={handleClick}
        className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
    >
      {children}
    </button>
  );
};

export const ProductCard = ({
  title,
  description,
  href,
  image,
}: {
  title: string;
  description: string;
  href: string;
  image: string;
}) => {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-white/10 transition-colors"
    >
      <img
        src={image}
        alt={title}
        className="w-14 h-10 rounded-md object-cover"
      />
      <div>
        <h4 className="text-sm font-medium text-white">
          {title}
        </h4>
        <p className="text-xs text-white/50">
          {description}
        </p>
      </div>
    </Link>
  );
};

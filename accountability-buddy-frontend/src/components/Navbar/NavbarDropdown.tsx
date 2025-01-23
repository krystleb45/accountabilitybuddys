import React, { useState, useRef, useEffect } from 'react';
import './NavbarDropdown.css';

interface NavbarDropdownProps {
  title: string;
  items: {
    label: string;
    onClick: () => void;
  }[];
}

const NavbarDropdown: React.FC<NavbarDropdownProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = (): void => setIsOpen((prev) => !prev);

  const closeDropdown = (): void => setIsOpen(false);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="navbar-dropdown"
      ref={dropdownRef}
      role="menu"
      aria-label={title}
      aria-expanded={isOpen}
    >
      <button
        className="dropdown-toggle"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-controls="dropdown-menu"
      >
        {title}
      </button>
      {isOpen && (
        <ul className="dropdown-menu" id="dropdown-menu">
          {items.map((item, index) => (
            <li key={index} className="dropdown-item">
              <button onClick={item.onClick} className="dropdown-link">
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavbarDropdown;

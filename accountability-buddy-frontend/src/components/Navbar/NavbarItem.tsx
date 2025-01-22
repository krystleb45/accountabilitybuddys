import React from "react";
import { NavLink } from "react-router-dom";
import "./NavbarItems.css";

interface NavbarItem {
  label: string;
  to: string;
  exact?: boolean;
  icon?: React.ReactNode; // Optional icon
  onClick?: () => void; // Optional click handler
}

interface NavbarItemsProps {
  items: NavbarItem[];
}

const NavbarItems: React.FC<NavbarItemsProps> = ({ items }) => {
  return (
    <ul className="navbar-items">
      {items.map((item, index) => (
        <li key={index} className="navbar-item">
          <NavLink
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
            onClick={item.onClick}
            aria-label={item.label}
          >
            {item.icon && <span className="navbar-item-icon">{item.icon}</span>}
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavbarItems;

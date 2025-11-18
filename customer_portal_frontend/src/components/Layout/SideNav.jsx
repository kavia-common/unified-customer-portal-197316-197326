import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * SideNav renders primary navigation.
 */
export default function SideNav() {
  const linkClass = ({ isActive }) =>
    `nav-link${isActive ? ' active' : ''}`;

  return (
    <aside className="sidenav" aria-label="Side Navigation">
      <div className="nav-group">Main</div>
      <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
      <NavLink to="/customers" className={linkClass}>Customers</NavLink>
      <NavLink to="/profile" className={linkClass}>Profile</NavLink>
    </aside>
  );
}

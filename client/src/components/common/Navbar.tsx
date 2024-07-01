import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => (
  <div className="navbar bg-base-300">
    <div className="flex-1">
      <NavLink className="btn btn-ghost text-xl" to="/">
        Dѻmѻ
      </NavLink>
    </div>
    <div className="flex-none">
      <ul className="menu menu-horizontal px-1">
        <li>
          <NavLink to="/canales">Canales</NavLink>
        </li>
        <li>
          <NavLink to="/envios">Envios</NavLink>
        </li>
      </ul>
    </div>
  </div>
);

export default Navbar;

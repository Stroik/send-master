import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => (
  <div className="navbar bg-base-300">
    <div className="flex-1">
      <NavLink className="btn btn-ghost items-center flex gap-0" to="/">
        <i className="ri-dice-line text-primary text-2xl"></i>{" "}
        <span className="text-xl -mt-[4px]">SendMaster</span>
      </NavLink>
    </div>
    <div className="flex-none">
      <ul className="menu menu-horizontal px-1 gap-2">
        <li>
          <NavLink to="/canales">Canales</NavLink>
        </li>
        <li>
          <NavLink to="/envios">Envios</NavLink>
        </li>
        <li>
          <NavLink to="/respuestas">Respuestas</NavLink>
        </li>
        <li>
          <NavLink to="/validacion">Filtrar números</NavLink>
        </li>
      </ul>
    </div>
  </div>
);

export default Navbar;

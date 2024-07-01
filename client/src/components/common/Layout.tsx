import { Outlet } from "react-router-dom";

const Layout: React.FC = (): JSX.Element => (
  <section className="p-6 h-full w-full ">
    <Outlet />
  </section>
);

export default Layout;

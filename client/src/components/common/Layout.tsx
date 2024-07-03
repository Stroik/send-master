import { Outlet } from "react-router-dom";

const Layout: React.FC = (): JSX.Element => (
  <section className="h-full w-full ">
    <Outlet />
  </section>
);

export default Layout;

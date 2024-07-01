import { Link } from "react-router-dom";
import CanalesList from "../components/canales/CanalesList";
import PageHeader from "../components/common/Pageheader";

const Canales: React.FC = () => {
  return (
    <>
      <PageHeader
        title="Listado de canales"
        subtitle="Cada canal representa cuatro (4) pestañas del navegador abiertas en segundo plano que gestionan Whatsapp Web"
      >
        <>
          <Link className="btn btn-primary" to="nuevo">
            Agregar canal
          </Link>
        </>
      </PageHeader>
      <CanalesList />
    </>
  );
};

export default Canales;

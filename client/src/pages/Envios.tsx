import { Link } from "react-router-dom";
import PageHeader from "../components/common/Pageheader";
import EnviosList from "../components/envios/EnviosList";

const Envios: React.FC = () => (
  <>
    <PageHeader
      title="Envio de mensajes"
      subtitle="Listado de envíos realizados. Se pueden filtrar desde la tabla y exportarlos a CSV"
    >
      <Link className="btn btn-primary" to="nuevo">
        Nuevo envío
      </Link>
    </PageHeader>
    <EnviosList />
  </>
);

export default Envios;

import { Link } from "react-router-dom";
import PageHeader from "../components/common/Pageheader";
import EnviosList from "../components/envios/EnviosList";

const Envios: React.FC = () => (
  <>
    <PageHeader
      title="Envio de mensajes"
      subtitle="Este es otro texto lorem ipsum para rellenar espacio y luego reemplazarlo por otro texto más descriptivo que no pensaré ahora"
    >
      <Link className="btn btn-primary" to="nuevo">
        Nuevo envío
      </Link>
    </PageHeader>
    <EnviosList />
  </>
);

export default Envios;

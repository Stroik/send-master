import PageHeader from "../components/common/Pageheader";
import EnvioForm from "../components/envios/EnvioForm";

const NuevoEnvio: React.FC = () => (
  <>
    <PageHeader
      title="Envia mensajes"
      subtitle="Este es otro texto lorem ipsum para rellenar espacio y luego reemplazarlo por otro texto más descriptivo que no pensaré ahora"
    ></PageHeader>
    <EnvioForm />
  </>
);

export default NuevoEnvio;

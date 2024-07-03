import PageHeader from "../components/common/Pageheader";
import RespuestasList from "../components/respuestas/RespuestasList";

const Respuestas: React.FC = () => (
  <>
    <PageHeader
      title="Respuestas recibidas"
      subtitle="Se listan las respuestas recibidas de las distintas campañas de envío."
    />
    <RespuestasList />
  </>
);

export default Respuestas;

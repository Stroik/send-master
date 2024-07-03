import PageHeader from "../components/common/Pageheader";
import CanalesForm from "../components/canales/CanalesForm";

const NuevoCanal: React.FC = () => (
  <>
    <PageHeader
      title="Agrega un nuevo canal"
      subtitle="Solicita un QR, esto creará un nuevo Whatsapp y podrás registrarlo escaneando el código QR"
    ></PageHeader>
    <CanalesForm />
  </>
);

export default NuevoCanal;

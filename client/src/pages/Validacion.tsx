import PageHeader from "../components/common/Pageheader";
import ValidacionForm from "../components/validacion/ValidacionForm";

const Validacion: React.FC = () => (
  <>
    <PageHeader
      title="Filtrar números válidos"
      subtitle="Suba una base de datos y filtre los números con Whatsapp activo"
    />
    <ValidacionForm />
  </>
);

export default Validacion;

import PageHeader from "../components/common/Pageheader";
import QRCodeReceiver from "../components/QRCodeReceiver";

const NuevoCanal: React.FC = () => (
  <>
    <PageHeader
      title="Agrega un nuevo canal"
      subtitle="Este es otro texto lorem ipsum para rellenar espacio y luego reemplazarlo por otro texto más descriptivo que no pensaré ahora"
    ></PageHeader>
    <QRCodeReceiver />
  </>
);

export default NuevoCanal;

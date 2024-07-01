import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { formatDate } from "../../utils/date";

const EnviosList: React.FC = () => {
  const [rowData, setRowData] = useState([]);

  const [colDefs, setColDefs] = useState([
    { field: "Whatsapp.phone", headerName: "Enviado desde" },
    { field: "phone", headerName: "Enviado a" },
    { field: "content", headerName: "Mensaje" },
    { field: "media", headerName: "Multimedia" },
    {
      field: "status",
      headerName: "Estado",
      cellRenderer: ({ data }: any) => (
        <>{data.status === "SENT" ? "Enviado" : "No enviado"}</>
      ),
    },
    {
      field: "createdAt",
      headerName: "Fecha de envío",
      cellRenderer: ({ data }: any) => <>{formatDate(data.createdAt)}</>,
    },
  ]);

  const defaultCol = useMemo(
    () => ({
      flex: 1,
    }),
    []
  );

  const getMessages = async () => {
    const response = await axios.get("http://localhost:3000/api/messages");
    if (response.status !== 200) return "error";

    setRowData(response.data);
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <div className="ag-theme-material-dark">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs as any}
        domLayout="autoHeight"
        animateRows
        defaultColDef={defaultCol}
      />
    </div>
  );
};

export default EnviosList;

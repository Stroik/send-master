import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatDate } from "../../utils/date";
import "ag-grid-enterprise";

const EnviosList: React.FC = () => {
  const gridRef = useRef<any>(null);
  const [rowData, setRowData] = useState([]);

  const [colDefs] = useState([
    {
      field: "Whatsapp.phone",
      headerName: "Enviado desde",
      filter: "agTextColumnFilter",
    },
    { field: "to", headerName: "Enviado a", filter: "agTextColumnFilter" },
    { field: "content", headerName: "Mensaje", filter: "agTextColumnFilter" },
    { field: "media", headerName: "Multimedia", filter: "agTextColumnFilter" },
    { field: "campaign", headerName: "Campaña", filter: "agTextColumnFilter" },
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
      filter: "agDateColumnFilter",
    },
  ]);

  const defaultCol = useMemo(
    () => ({
      flex: 1,
      minWidth: 100,
      filter: true,
      resizable: true,
      sortable: true,
    }),
    []
  );

  const getMessages = async () => {
    const response = await axios.get("http://localhost:3000/api/messages");
    if (response.status !== 200) return "error";

    setRowData(response.data);
  };

  const exportToCSV = () => {
    const fileName = `Mensajes recibidos hasta ${formatDate(new Date())}`;
    gridRef.current?.api?.exportDataAsCsv({ fileName });
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <div className="envios-list flex flex-col">
      <div className="dropdown ml-auto dropdown-end">
        <div tabIndex={0} role="button" className="btn mb-2">
          Exportar <i className="ri-download-cloud-line"></i>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <button onClick={exportToCSV}>CVS</button>
          </li>
        </ul>
      </div>
      <div className="ag-theme-material-dark">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs as any}
          domLayout="autoHeight"
          animateRows
          defaultColDef={defaultCol}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50, 100]}
          localeText={{
            page: "Página",
            of: "de",
            to: "a",
          }}
        />
      </div>
    </div>
  );
};

export default EnviosList;

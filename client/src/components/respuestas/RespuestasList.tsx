import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { socket } from "../../lib/socket";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { formatDate } from "../../utils/date";
import "ag-grid-enterprise";

type ISocketMessageReceived = {
  id: string;
  body: string;
  from: string;
  hasMedia: boolean;
};

const RespuestasList: React.FC = () => {
  const gridRef = useRef<any>(null);
  const firstRender = useRef<boolean>(true);

  const [answers, setAnswers] = useState<Array<ISocketMessageReceived>>([]);
  const [colDefs] = useState([
    {
      field: "from",
      headerName: "Enviado desde",
      filter: "agTextColumnFilter",
      cellRenderer: ({ data }: any) => (
        <>{(data.from as string).replace("@c.us", "")}</>
      ),
    },
    { field: "to", headerName: "Recibido a", filter: "agTextColumnFilter" },
    { field: "content", headerName: "Mensaje", filter: "agTextColumnFilter" },
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
      filter: true, // Activar filtros por defecto
      resizable: true, // Hacer las columnas redimensionables
      sortable: true, // Hacer las columnas ordenables
    }),
    []
  );

  const getAnswers = useCallback(async () => {
    const response = await axios.get(
      "http://localhost:3000/api/messages/answers"
    );
    if (response.status !== 200) return "error";

    setAnswers(response.data);
  }, []);

  const exportToCSV = () => {
    const fileName = `Mensajes enviados hasta ${formatDate(new Date())}`;
    gridRef.current?.api?.exportDataAsCsv({ fileName });
  };

  useEffect(() => {
    if (firstRender.current) {
      getAnswers();
      firstRender.current = false;
    }

    socket.on("message-received", () => {
      getAnswers();
    });

    return () => {
      socket.off("message-received");
    };
  }, [answers]);

  return (
    <div className="respuestas-list  flex flex-col">
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
          rowData={answers}
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

export default RespuestasList;

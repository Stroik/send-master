import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { socket } from "../../lib/socket";
import { handleStatus } from "../../utils/status";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/date";

const CanalesList: React.FC = () => {
  const [isLoggin, setIsLoggin] = useState<boolean>(false);
  const [RAM, setRAM] = useState<Array<number>>([]);

  const cellRenderer = ({ data }: any) => (
    <div className="flex h-full gap-2 items-center justify-center">
      {isLoggin ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <button
          className="btn btn-xs btn-square btn-outline btn-success tooltip tooltip-left"
          data-tip="Iniciar"
          onClick={() => handleLogin(data.id)}
          disabled={data.status === "READY"}
        >
          <i className="ri-login-circle-line"></i>
        </button>
      )}
      <button
        className="btn btn-xs btn-square btn-outline btn-error tooltip tooltip-right"
        data-tip="Eliminar"
        onClick={() => handleDelete(data.id)}
        disabled={isLoggin}
      >
        <i className="ri-delete-bin-fill"></i>
      </button>
    </div>
  );

  const [rowData, setRowData] = useState([]);
  const [colDefs] = useState([
    {
      field: "phone",
      headerName: "Número",
    },
    {
      field: "status",
      headerName: "Estado",
      cellRenderer: ({ data }: any) => <>{handleStatus(data.status)}</>,
    },
    {
      field: "updatedAt",
      headerName: "Última sesión",
      cellRenderer: ({ data }) => <>{formatDate(data.updatedAt)}</>,
    },
    {
      field: "",
      headerComponent: () => {
        return <span>% RAM</span>;
      },
      cellRenderer: () => {
        const [minRam, maxRam] = consumedRAM(4);

        return (
          <span>
            {minRam}MB/{maxRam}MB
          </span>
        );
      },
    },
    {
      field: "",
      headerComponent: () => {
        return <div className="w-full text-center">Acciones</div>;
      },
      cellRenderer,
    },
  ]);

  const firstRender = useRef(true);

  const consumedRAM = (tabQuantity: number): [number, number] => {
    const minRamPerTabMB = 30;
    const maxRamPerTabMB = 100;

    const minConsumedRAM = tabQuantity * minRamPerTabMB;
    const maxConsumedRAM = tabQuantity * maxRamPerTabMB;

    return [minConsumedRAM, maxConsumedRAM];
  };

  const handleLogin = (id: string) => {
    setIsLoggin(true);
    toast("Se está iniciando sesión en Whatsapp Web");
    socket.emit("login-whatsapp", id);
  };

  const handleDelete = (id: string) => {
    const sure = confirm("¿Estás seguro que querés borrar el canal?");
    if (sure) {
      axios
        .delete(`http://localhost:3000/api/whatsapp/${id}`)
        .finally(() => getCanales());
    }
  };

  const defaultCol = useMemo(
    () => ({
      flex: 1,
    }),
    []
  );

  const getCanales = useCallback(async () => {
    const response = await axios.get("http://localhost:3000/api/whatsapp");
    setRowData(response.data);
    const [minRam, maxRam] = consumedRAM(response.data.length * 4);
    setRAM([minRam, maxRam]);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      getCanales();
      firstRender.current = false;
    }

    socket.on("whatsapp-loging", () => {
      setIsLoggin(true);
    });

    socket.on("whatsapp-ready", (phone: string) => {
      getCanales();
      setIsLoggin(false);
      toast.success(`El número ${phone} ha iniciado sesión`);
    });

    return () => {
      socket.off("whatsapp-loging");
      socket.off("whatsapp-ready");
    };
  }, [getCanales]);

  return (
    <div className="flex flex-col gap-6">
      <div className="ag-theme-material-dark">
        <AgGridReact
          key={isLoggin ? "loggin-true" : "loggin-false"}
          rowData={rowData}
          columnDefs={colDefs as any}
          domLayout="autoHeight"
          animateRows
          defaultColDef={defaultCol}
        />
      </div>
      <button className="btn btn-accent btn-sm self-end">
        RAM Total Aprox {RAM[0]}MB/{RAM[1]}MB
      </button>
    </div>
  );
};

export default CanalesList;

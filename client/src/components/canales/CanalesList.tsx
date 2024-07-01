import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { socket } from "../../lib/socket";

const CanalesList: React.FC = () => {
  const [isLoggin, setIsLoggin] = useState<boolean>(false);
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    {
      field: "phone",
      headerName: "Número",
    },
    {
      field: "status",
      headerName: "Estado",
    },
    {
      field: "updatedAt",
      headerName: "Última sesión",
    },
    {
      field: "",
      headerName: "% RAM",
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
      cellRenderer: ({ data }: any) => (
        <div className="flex h-full gap-2 items-center justify-center">
          <button
            className="btn btn-xs btn-square btn-outline btn-sucess tooltip tooltip-left"
            data-tip="Iniciar"
            disabled={data.status === "READY" || isLoggin}
            onClick={() => handleLogin(data.id)}
          >
            <i className="ri-login-circle-line"></i>
          </button>
          <button
            className="btn btn-xs btn-square btn-outline btn-error tooltip tooltip-right"
            data-tip="Eliminar"
            onClick={() => {
              const sure = confirm("¿Estás seguro que querés borrar el canal?");
              if (sure)
                axios.delete(`http://localhost:3000/api/whatsapp/${data.id}`);
            }}
            disabled={isLoggin}
          >
            <i className="ri-delete-bin-fill"></i>
          </button>
        </div>
      ),
    },
  ]);

  const consumedRAM = (tabQuantity: number): [number, number] => {
    const minRamPerTabMB = 30;
    const maxRamPerTabMB = 100;

    const minConsumedRAM = tabQuantity * minRamPerTabMB;
    const maxConsumedRAM = tabQuantity * maxRamPerTabMB;

    return [minConsumedRAM, maxConsumedRAM];
  };

  const handleLogin = (id: string) => {
    setIsLoggin(true);
    socket.emit("login-whatsapp", id);
  };

  const defaultCol = useMemo(
    () => ({
      flex: 1,
    }),
    []
  );

  const getCanales = async () => {
    const response = await axios.get("http://localhost:3000/api/whatsapp");
    setRowData(response.data);
  };

  useEffect(() => {
    getCanales();

    socket.on("whatsapp-loging", (id) => {
      console.log("whatsapp loging", id);
      setIsLoggin(true);
    });

    socket.on("whatsapp-ready", () => {
      getCanales();
      setIsLoggin(false);
    });

    return () => {
      socket.off("whatsapp-loging");
    };
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

export default CanalesList;

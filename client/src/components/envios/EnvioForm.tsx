import { type FormEvent, useState } from "react";
import { read, utils } from "xlsx";
import MessageWithVars from "./MessageWithVars";
import { socket } from "../../lib/socket";
import { timer } from "../../utils/timer";

interface IWorkSheet {
  phone: string;
  [key: string]: string | number | undefined;
}

interface IRow extends IWorkSheet {
  name: string;
  content: string;
}

interface IEnvio extends IWorkSheet {
  message: string;
}

const EnvioForm: React.FC = () => {
  const [db, setDb] = useState<IRow[]>([]);
  const [dbName, setDbName] = useState<string>("");
  const [isPopulating, setIsPopulating] = useState<boolean>(false);
  const [vars, setVars] = useState<Array<string>>([]);
  const [envio, setEnvio] = useState<IEnvio>({
    phone: "",
    message: "",
  });

  const handleImport = ($event: FormEvent<HTMLInputElement>) => {
    const files = $event.currentTarget.files;

    if (files?.length) {
      const file = files[0];
      setDbName(file.name);
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setIsPopulating(true);
          const wb = read(event.target.result as ArrayBuffer);
          const sheets = wb.SheetNames;

          if (sheets.length) {
            let rows = utils.sheet_to_json(
              wb.Sheets[sheets[0]]
            ) as IWorkSheet[];
            const allKeys: Set<string> = new Set();
            const formattedRows = rows
              .map((row) => {
                let formattedRow: any = {};
                Object.keys(row).forEach((key) => {
                  const newKey = key.replace(/\s+/g, "_");
                  formattedRow[newKey] = row[key];
                  allKeys.add(newKey);
                });
                let { phone } = formattedRow;
                phone = String(phone);
                return {
                  ...formattedRow,
                  phone: phone,
                };
              })
              .filter((row): row is IRow => row !== undefined);

            const uniques = [...new Set(formattedRows)];
            setDb(uniques);
            setVars(Array.from(allKeys));
          }
          setIsPopulating(false);
        }
      };
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => setIsPopulating(false);
    }
  };

  const replaceVars = (message: string, row: IWorkSheet): string => {
    return message.replace(/\${(.*?)}/g, (_, variable) => {
      const value = row[variable];
      return value !== undefined ? String(value) : "";
    });
  };

  const handleSubmit = async () => {
    let i = 0;
    while (i < db.length) {
      if (i === db.length) break;

      const row = db[i];
      const message = replaceVars(envio.message, row);
      socket.emit("send-message", {
        phone: row.phone,
        message,
        media: envio.media,
        format: envio.format,
      });
      await timer(5000);

      i++;
    }
  };

  return (
    <div className="envios-form flex flex-col gap-6">
      <div className="custom-file">
        <label
          className="cursor-pointer flex w-full flex-col items-center rounded border-2 border-dashed p-6 text-center"
          htmlFor="inputGroupFile"
        >
          <i className="ri-file-excel-2-line text-6xl"></i>
          {dbName ? (
            <>
              <h2 className="mt-4 text-xl font-medium text-gray-700 dark:text-slate-50 tracking-wide">
                {dbName}
              </h2>
              <span className="mt-2 text-gray-500 tracking-wide dark:text-slate-100">
                Cantidad de contactos <strong>{db.length}</strong>
              </span>
            </>
          ) : (
            <>
              <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide dark:text-slate-50">
                Cargar base de datos
              </h2>
              <span className="mt-2 text-gray-500 tracking-wide dark:text-slate-100">
                Formatos admitidos de bases de datos{" "}
                <strong>CSV, XLS, XLSX</strong>
              </span>
              {isPopulating && (
                <span className="loading loading-spinner"></span>
              )}
            </>
          )}
          <input
            type="file"
            name="file"
            className="hidden"
            id="inputGroupFile"
            required
            onChange={handleImport}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </label>
      </div>

      <MessageWithVars setstate={setEnvio} state={envio} vars={vars} />

      <div className="flex w-full justify-between">
        <div className="join">
          <div className="indicator">
            <button className="btn join-item">Multimedia</button>
          </div>
          <div>
            <div>
              <input
                className="input input-bordered join-item"
                placeholder="C:/Users/bla/file.mp4"
                onChange={(event) =>
                  setEnvio((prev) => ({ ...prev, media: event.target.value }))
                }
              />
            </div>
          </div>
          <select
            className="select select-bordered join-item"
            onChange={(event) =>
              setEnvio((prev) => ({ ...prev, format: event.target.value }))
            }
          >
            <option disabled>Formato</option>
            <option value="imagen">Imagen</option>
            <option value="video">Video</option>
            <option value="documento">Documento</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default EnvioForm;

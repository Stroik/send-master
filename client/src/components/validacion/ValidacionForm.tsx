import { read, utils, type WorkBook, type WorkSheet, writeFile } from "xlsx";
import { FormEvent, useEffect, useState } from "react";
import { socket } from "../../lib/socket";
import { uniqBy } from "lodash-es";
import { timer } from "../../utils/timer";

interface IWorkSheet {
  phone: string;
  [key: string]: string | number | undefined;
}

interface IRow {
  name: string;
  phone: string;
  info: string;
  userId?: string | number;
}

interface Database {
  phone: string;
}

const ValidacionForm: React.FC = () => {
  const [db, setDb] = useState<Database[]>([]);
  const [validated, setValidated] = useState<Database[]>([]);
  const [dbName, setDbName] = useState("");
  const [error, setError] = useState("");
  const [validatedList, setValidatedList] = useState<Database[]>([]);
  const [failed, setFailed] = useState<any[]>([]);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isPopulating, setIsPopulating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [_validationInProgress, setValidationInProgress] =
    useState<boolean>(false);
  const [timeout, _setTimeout] = useState<number>(0);

  const [isValidationError, setIsValidationError] = useState<boolean>(false);

  const handleImport = ($event: FormEvent<HTMLInputElement>) => {
    const files = $event.currentTarget.files;

    if (files?.length) {
      const file = files[0];
      setDbName(file.name);
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setIsPopulating(true);
          const wb = read(event.target.result as string);
          const sheets = wb.SheetNames;

          if (sheets.length) {
            let rows = utils.sheet_to_json(
              wb.Sheets[sheets[0]]
            ) as IWorkSheet[];
            const formattedRows = rows
              .map((row) => {
                let { phone, ...rest } = row;
                phone = String(phone);
                return {
                  phone: phone,
                  ...rest,
                };
              })
              .filter((row): row is IRow => row !== undefined);
            const uniques = [...new Set(formattedRows)];
            setDb(uniques);
          }
          setIsPopulating(false);
        }
      };
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => setIsPopulating(false);
    }
  };

  const handleSubmit = async () => {
    if (db.length) {
      setProgress(0.1);
      setIsValidating(true);
      setValidationInProgress(true);
      let i = 0;
      while (db.length) {
        if (i === db.length) break;
        if (isValidationError) break;
        const contact = db[i];
        await timer(timeout * 1000);
        socket.emit("validate", contact);
        setProgress(Math.round(((i + 1) / db.length) * 100));
        i++;
      }
      setIsValidating(false);
    } else {
      setError("La base de datos está vacía");
    }
    setValidationInProgress(false);
  };

  const handleExport = async () => {
    const wb: WorkBook = utils.book_new();

    // Hoja de números válidos
    const wsValid: WorkSheet = utils.json_to_sheet([]);
    const headings = [Object.keys(validatedList[0])];
    const dataValid = uniqBy(validatedList, "phone");

    utils.sheet_add_aoa(wsValid, headings);
    utils.sheet_add_json(wsValid, dataValid, {
      origin: "A2",
      skipHeader: true,
    });
    utils.book_append_sheet(wb, wsValid, "Validos");

    // Hoja de números inválidos
    const wsInvalid: WorkSheet = utils.json_to_sheet([]);
    const dataInvalid = uniqBy(failed, "phone");

    utils.sheet_add_aoa(wsInvalid, headings);
    utils.sheet_add_json(wsInvalid, dataInvalid, {
      origin: "A2",
      skipHeader: true,
    });
    utils.book_append_sheet(wb, wsInvalid, "No Validos");

    await writeFile(wb, `Filtrados - ${dbName}`);
  };

  useEffect(() => {
    socket.connect();

    socket.on("valid", (data) => {
      setValidatedList((prev: any) => [...prev, data]);
      setValidated((prev: any) => [...prev, data]);
      return;
    });

    socket.on("validated_error", () => {
      setIsValidating(false);
      setValidationInProgress(false);
      setProgress(99);
      setIsValidationError(true);
      socket.disconnect();
      return;
    });

    socket.on("not_valid", (data) => {
      setFailed((prev: any) => [...prev, data]);
      setValidated((prev: any) => [...prev, data]);
      return;
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <section id="validation">
      {progress > 0 && progress <= 100 && (
        <div className="flex items-center mb-4">
          <progress
            className="progress progress-primary w-full my-2"
            value={progress}
            max="100"
            id="progress"
          ></progress>
          <span className="ml-2">{progress}%</span>
        </div>
      )}
      {error.length > 0 && (
        <div className="alert alert-error my-4">
          <i className="ri-alert-fill text-4xl"></i>
          <span>{error}</span>
        </div>
      )}
      <div className="custom-file">
        <label
          className="cursor-pointer flex w-full flex-col items-center rounded border-2 border-dashed border-primary bg-base-200 p-6 text-center"
          htmlFor="inputGroupFile"
        >
          <i className="ri-file-excel-2-line text-6xl"></i>
          {dbName ? (
            <>
              <h2 className="mt-4 text-xl font-medium text-gray-700 dark:text-slate-50 tracking-wide">
                {dbName}
              </h2>
              <span className="mt-2 text-gray-500 tracking-wide dark:text-slate-100">
                Hay un total de <strong>{db.length}</strong> números de celular
                para verificar si tienen whatsapp activo
              </span>
            </>
          ) : (
            <>
              <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide dark:text-slate-50">
                Subir base de datos
              </h2>
              <span className="mt-2 text-gray-500 tracking-wide dark:text-slate-100">
                Formatos admitidos de bases de datos{" "}
                <strong>CSV, XLS, XLSX</strong>
              </span>
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
      <div className="flex gap-6 items-center">
        <div className="my-4 flex items-start gap-4 w-full">
          <div
            className="w-1/2 tooltip tooltip-primary tooltip-top "
            data-tip="Tiempo entre validacion"
          >
            <input
              type="range"
              min={0}
              max={30}
              value={timeout}
              className="range range-primary"
              step={5}
              onChange={(e) => _setTimeout(Number(e.target.value))}
              disabled={isValidating}
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>0s</span>
              <span>5s</span>
              <span>10s</span>
              <span>15s</span>
              <span>20s</span>
              <span>25s</span>
              <span>30s</span>
            </div>
          </div>
        </div>
        {progress !== 100 ? (
          <button
            className="btn btn-primary my-4"
            onClick={handleSubmit}
            disabled={!db.length || validatedList.length > 0}
          >
            {isValidating || isPopulating ? (
              <>
                <span>Validando...</span>
                <i className="loading loading-spinner loading-md"></i>
              </>
            ) : (
              <span>Validar números</span>
            )}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={progress !== 100}
          >
            <span className="flex items-center justify-center gap-2">
              <span>Exportar base de datos filtrados</span>
              <i className="ri-file-excel-2-line text-xl"></i>
            </span>
          </button>
        )}
      </div>
    </section>
  );
};

export default ValidacionForm;

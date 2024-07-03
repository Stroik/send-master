import { useEffect, useState } from "react";
import { socket } from "../../lib/socket";

type ProgressBarProps = {
  dbLength: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ dbLength }) => {
  const [failSent, setFailSent] = useState<number>(0);
  const [successSent, setSuccessSent] = useState<number>(0);
  const [sent, setSent] = useState<number>(0);

  useEffect(() => {
    socket.connect();

    socket.on("message-failed", () => {
      setFailSent(failSent + 1);
    });

    socket.on("message-success", () => {
      setSuccessSent(successSent + 1);
    });

    socket.on("message-sent", () => {
      setSent(sent + 1);
    });

    return () => {
      socket.off("message-failed");
      socket.off("message-success");
    };
  }, [sent, successSent, failSent]);

  return (
    <div className="flex flex-col items-center mb-4">
      <progress
        className="progress progress-info w-full my-2"
        value={sent}
        max={dbLength}
        id="progress"
      ></progress>
      <div className="flex w-full justify-between">
        <span>
          Total enviados <strong>{sent}</strong>
        </span>
        <span>
          Enviados con éxito <strong>{successSent}</strong>
        </span>
        <span>
          No enviados <strong>{failSent}</strong>
        </span>
        <span>
          Total a enviar <strong>{dbLength}</strong>
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;

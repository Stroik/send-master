import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { socket } from "../lib/socket";
import { useNavigate } from "react-router-dom";

const QRCodeReceiver: React.FC = () => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleRequestQr = () => {
    socket.emit("needQR");
  };

  useEffect(() => {
    socket.on("qrProcessing", () => {
      socket.emit("new-whatsapp");
      setIsProcessing(true);
    });

    socket.on("qrCode", (data) => {
      console.log("QR DATA", data);
      setQrCode(data);
    });

    socket.on("whatsapp-created", (id) => {
      socket.emit("initQR", id);
      setIsProcessing(false);
    });

    socket.on("whatsapp-authenticated", () => {
      console.log("Whatsapp authenticated");
    });
    socket.on("whatsapp-ready", () => {
      console.log("Whatsapp ready");
      navigate("/canales");
    });

    return () => {
      socket.off("qrCode");
      socket.off("qrProcessing");
    };
  }, []);

  return (
    <div className="card lg:card-side bg-base-200 max-w-4xl">
      {isProcessing ? (
        <figure>
          <div className="skeleton w-96 h-96 aspect-square"></div>
        </figure>
      ) : null}

      {!isProcessing && qrCode.length ? (
        <figure className="p-2 bg-white aspect-square">
          <QRCodeSVG value={qrCode} size={300} />
        </figure>
      ) : null}

      {!isProcessing && !qrCode.length ? (
        <figure>
          <div className="bg-base-300 w-96 h-96 aspect-square grid place-items-center">
            <i className="ri-qr-code-line text-7xl" />
          </div>
        </figure>
      ) : null}

      <div className="card-body">
        <h2 className="card-title">Nuevo canal</h2>
        <p>
          Al hacer click en <strong>Solicitar QR</strong> se creará una nueva
          instancia de Whatsapp Web en 2do plano
        </p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary"
            onClick={handleRequestQr}
            disabled={isProcessing}
          >
            Solicitar QR
            {isProcessing ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <i className="ri-qr-code-line text-xl" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeReceiver;

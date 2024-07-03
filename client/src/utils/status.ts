export const handleStatus = (status: string) => {
  switch (status) {
    case "READY":
      return "Conectado";
    case "DISCONNECTED":
      return "Desconectado";
    case "UPDATED":
      return "No iniciado";
    default:
      return "Desconectado";
  }
};

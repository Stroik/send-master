interface MessageWithVarsProps {
  vars: Array<string>;
  state: any;
  setstate: React.Dispatch<React.SetStateAction<any>>;
}

const MessageWithVars = ({ vars, state, setstate }: MessageWithVarsProps) => {
  return (
    <div className="w-full relative">
      <textarea
        className="textarea textarea-primary textarea-lg w-full h-full"
        onChange={(e) =>
          setstate((prev: any) => ({ ...prev, message: e.target.value }))
        }
        value={state.message}
        placeholder="Escribe el mensaje a enviar"
      ></textarea>
      <div className="flex flex-wrap gap-2 absolute bottom-2 left-6">
        {vars.map((variable, i) => (
          <span
            key={i}
            className="btn btn-outline btn-xs"
            onClick={() =>
              setstate((prev: any) => ({
                ...prev,
                message: prev.message + " ${" + variable + "}",
              }))
            }
          >
            {variable}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MessageWithVars;

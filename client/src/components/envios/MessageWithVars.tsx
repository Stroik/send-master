interface MessageWithVarsProps {
  vars: Array<string>;
  state: any;
  setstate: React.Dispatch<React.SetStateAction<any>>;
}

const MessageWithVars = ({ vars, state, setstate }: MessageWithVarsProps) => {
  return (
    <div className="w-full">
      <label className="label">
        <span className="label-text">Mensaje a enviar</span>
        <span
          className="label-text-alt tooltip tooltip-left"
          data-tip="Haz click en las variables para agregarlas al mensaje"
        >
          <i className="ri-information-line text-primary text-2xl"></i>
        </span>
      </label>
      <textarea
        className="textarea textarea-primary textarea-lg w-full min-h-48"
        onChange={(e) =>
          setstate((prev: any) => ({ ...prev, message: e.target.value }))
        }
        value={state.message}
      ></textarea>
      <div className="flex flex-wrap gap-2">
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

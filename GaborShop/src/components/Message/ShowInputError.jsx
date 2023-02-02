import "./message.css";

export default function ShowInputError({ status, inputName }) {
  return (
    <>
      {status.errors[inputName] !== "undefined" && (
        <div className="input-error">{status.errors[inputName]}</div>
      )}
    </>
  );
}

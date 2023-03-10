export default function ShowInputError({ status, inputName }) {
  return (
    <>
      {status.errors[inputName] && (
        <div className="input-error">{status.errors[inputName]}</div>
      )}
    </>
  );
}

export default function ShowInputError({ status, inputName }) {
  return (
    <>
      {status.errors[inputName] !== "undefined" && (
        <div style={{ color: "red" }}>{status.errors[inputName]}</div>
      )}
    </>
  );
}

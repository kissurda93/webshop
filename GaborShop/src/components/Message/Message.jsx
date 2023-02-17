export default function Message({ message, type }) {
  return (
    <>
      {message ? (
        <div className={type ? "message message-failed" : "message"}>
          <p>{message}</p>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

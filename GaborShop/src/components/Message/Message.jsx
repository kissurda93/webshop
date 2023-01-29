import "./message.css";

export default function Message({ message, type }) {
  return (
    <div>
      {message ? (
        <div className={type ? "message message-failed" : "message"}>
          <p>{message}</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default function Spinner({ dark = false, big = false }) {
  return (
    <div
      className={`spinner ${dark && "spinner-dark"} ${big && "spinner-big"}`}
    ></div>
  );
}

import Image from "../../public/notfound.png";
function Notfound() {
  return (
    <div>
      <img className="notfound-image" src={Image} alt="notfound" />
    </div>
  );
}

export default Notfound;

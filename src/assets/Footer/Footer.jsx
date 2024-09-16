import "./Footer.css";

export default function Header() {
  return (
    <div className="footer">
      <div className="footer-note">
        <text className="footer-heading">flavory</text>
        <text className="footer-subtext">Where every dish delights</text>
      </div>
      <div className="footer-disclaimer">
        <text className="footer-heading">Disclaimer</text>
        <text className="footer-subtext">flavory does not host any recipes itself but instead only display's content from 3rd party providers</text>
      </div>
    </div>
  );
}

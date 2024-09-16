import "./Footer.css";

export default function Header() {
  return (
    <div className="footer">
      <div className="footer-container">
      <div className="footer-note">
        <text className="footer-heading">flavory</text>
        <text className="footer-subtext">where every dish delights.</text>
      </div>
      <div className="footer-disclaimer">
        <text className="footer-heading">disclaimer</text>
        <text className="footer-subtext">flavory does not host any recipes directly but instead showcases content from third-party providers.</text>
      </div>
      </div>
    </div>
  );
}

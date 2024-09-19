import "./Footer.css";

export default function Header() {
  return (
    <div className="footer">
      <div className="footer-container">
      <div className="footer-note">
        <span className="footer-heading">flavory</span>
        <span className="footer-subtext">where every dish delights.</span>
      </div>
      <div className="footer-disclaimer">
        <span className="footer-heading">disclaimer</span>
        <span className="footer-subtext">flavory does not host any recipes directly but instead showcases content from third-party providers.</span>
      </div>
      </div>
    </div>
  );
}

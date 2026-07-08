import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! We're</h2>
            <h1>
              WEB N BUILD
            </h1>
          </div>
          <div className="landing-info">
            <h3>A Creative</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">AGENCY</div>
              <div className="landing-h2-2">ECOMMERCE</div>
            </h2>
            <h2>
              <div className="landing-h2-info">ECOMMERCE</div>
              <div className="landing-h2-info-1">AGENCY</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;

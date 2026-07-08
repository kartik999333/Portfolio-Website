import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Our <span>services</span>
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Store Setup</h4>
                <h5>Shopify build, checkout & theme</h5>
              </div>
              <h3>Package 01</h3>
            </div>
            <p>
              Full store build from scratch — theme, product pages, checkout,
              and payment setup, ready to launch.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Custom Design</h4>
                <h5>Brand-matched storefront</h5>
              </div>
              <h3>Package 02</h3>
            </div>
            <p>
              Custom visuals, size charts, banners, and layout built around
              your brand — not a stock theme.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Ongoing Management</h4>
                <h5>Monthly updates & support</h5>
              </div>
              <h3>Ongoing</h3>
            </div>
            <p>
              New drops, fixes, and small changes handled every month so your
              store keeps up with your brand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;

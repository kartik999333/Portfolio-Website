import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Us</h3>
        <p className="para">
          Webnbuild is a Shopify store-building studio. We help brands selling
          through Instagram DMs move onto a real online store — one that's built
          for how they actually sell, not a generic template with a logo swap.
          From product pages to checkout, we build stores that turn followers
          into customers.
        </p>
      </div>
      <div className="about-character-image">
        <img src="/images/about-character.png" alt="WEB N BUILD Developer character" />
      </div>
    </div>
  );
};

export default About;

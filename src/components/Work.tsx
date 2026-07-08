import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const projects = [
  {
    number: "01",
    name: "Azzo Furniture",
    category: "Furniture / Home Decor",
    website: "azzomodenfurniture.com",
    description: "A premium furniture storefront that gives Azzo's catalog the same trust and polish as its in-store showroom — built to turn browsers into buyers.",
    image: "/images/azzo.jpg",
  },
  {
    number: "02",
    name: "1 Street",
    category: "Fashion / Streetwear",
    website: "1street.in",
    description: "A fast, mobile-first store that helped 1 Street move beyond Instagram DMs and convert followers into paying customers.",
    image: "/images/onestreet.jpg",
  },
  {
    number: "03",
    name: "Arshi Modewear",
    category: "Women's Fashion / Modest Wear",
    website: "arshimodwear.com",
    description: "A clean, professional storefront that gave Arshi Modewear the credibility of an established fashion brand, not just an Instagram page.",
    image: "/images/arshi.jpg",
  },
  {
    number: "04",
    name: "Shri Paramanij Jewels",
    category: "Jewelry",
    website: "shriparamanijewels.com",
    description: "An elegant, minimal storefront designed to match the trust and craftsmanship jewelry buyers expect before they spend.",
    image: "/images/shri.jpg",
  },
  {
    number: "05",
    name: "Gleame",
    category: "Anime Streetwear / Apparel",
    website: "gleame.co.in",
    description: "A high-volume streetwear store built to handle daily order flow and turn one-time buyers into repeat customers.",
    image: "/images/gleame.jpg",
  },
];

const Work = () => {
  useGSAP(() => {
  let translateX: number = 0;

  function setTranslateX() {
    const box = document.getElementsByClassName("work-box");
    const rectLeft = document
      .querySelector(".work-container")!
      .getBoundingClientRect().left;
    const rect = box[0].getBoundingClientRect();
    const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
    let padding: number =
      parseInt(window.getComputedStyle(box[0]).padding) / 2;
    translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
  }

  setTranslateX();

  let timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".work-section",
      start: "top top",
      end: "+=1500",
      scrub: 0.5,
      pin: true,
      pinSpacing: true,
      pinType: ScrollTrigger.isTouch ? "fixed" : "transform",
      id: "work",
    },
  });

  timeline.to(".work-flex", {
    x: -translateX,
    duration: 500,
    delay: 0.2,
  });

  const handleResize = () => {
    let debounce: any = null;
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      setTranslateX();
    }, 200);
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    timeline.kill();
    ScrollTrigger.getById("work")?.kill();
  };
}, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Our <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>{project.number}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                    <a
                      href={`https://${project.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "12px",
                        opacity: 0.7,
                        color: "var(--accentColor)",
                        textDecoration: "underline",
                        display: "block",
                        marginTop: "5px",
                      }}
                      data-cursor="disable"
                    >
                      Visit: {project.website}
                    </a>
                  </div>
                </div>
                <p>{project.description}</p>
              </div>
              <WorkImage image={project.image} alt={project.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;

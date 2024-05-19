import React from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { homeCarouselData } from "./HomeCaroselData";
import { useNavigate } from "react-router-dom";

const handleDragStart = (e) => e.preventDefault();

const HomeCarousel = () => {
  const navigate = useNavigate();
  const item = homeCarouselData.map((item, index) => (
    <img
      className="cursor-pointer"
      // onClick={() => navigate(item.path)}
      // src={`${item.image}`}
      src="https://images.ctfassets.net/gqlaeh1nu6o2/7Ac7uzIJGeCILNlzqgL2Bf/328f12f6adc201c9bed596f72736d396/JJ2405_E09_A2_Hero_AU.jpg"
      alt={`banner-${index + 1}`}
      onDragStart={handleDragStart}
      role="presentation"
      // style={{ height: 450, width: 1500 }}
      style={{
        width: "100vw",
        objectFit: "contain",
        height: "auto",
      }}
    />
  ));
  return (
    <>
      <p className="flex h-10 items-center justify-center bg-black px-4 text-sm font-medium text-white sm:px-6 lg:px-8 tracking-wider">
        $5 DELIVERY WHEN YOU SPEND{" "}
        <span className="font-extrabold tracking-wider inline-block px-1">
          {" "}
          $130+
        </span>{" "}
        SITEWIDE |{" "}
        <span className="font-extrabold tracking-wider inline-block px-1">
          ENDS SUNDAY
        </span>
      </p>
      <AliceCarousel
        mouseTracking
        items={item}
        autoPlay
        infinite
        autoPlayInterval={3000}
        disableButtonsControls
      />
    </>
  );
};

export default HomeCarousel;

// import { Card, CardBody, Image, CardFooter } from "@nextui-org/react";
import { Swiper, SwiperSlide } from "./SwiperElement";
import propTypes from "prop-types";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";

function Carousel({ data = [] }) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setScreenWidth(window.innerWidth);
    });
  }, []);

  return (
    <section className="">
      <div className="pb-10 max-w-5xl mx-auto">
        <Swiper
          autoplay={{
            delay: 2000,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            980: {
              slidesPerView: 3,
            },
          }}
          loop={true}
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          coverflowEffect={{
            rotate: 25,
            depth: 150,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{
            dynamicBullets: true,
            clickable: true,
          }}
        >
          {data.map((item) => (
            <SwiperSlide
              style={{ maxWidth: screenWidth < 980 ? "100%" : "340px" }}
              key={item._id}
            >
              <ProductCard data={item} rounded={false} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

Carousel.propTypes = {
  data: propTypes.array,
};

export default Carousel;

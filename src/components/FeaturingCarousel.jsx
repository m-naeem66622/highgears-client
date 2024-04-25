import { Swiper, SwiperSlide } from "./SwiperElement";
import SLIDE_NO_1 from "../assets/slide_no_1.jpg";
import SLIDE_NO_2 from "../assets/slide_no_2.jpg";
import SLIDE_NO_3 from "../assets/slide_no_3.jpg";
import SLIDE_NO_4 from "../assets/slide_no_4.jpg";
import SLIDE_NO_5 from "../assets/slide_no_5.jpg";

const FeaturingCarousel = () => {
  const data = [SLIDE_NO_1, SLIDE_NO_2, SLIDE_NO_3, SLIDE_NO_4, SLIDE_NO_5];

  return (
    <section className="">
      <div className="pb-10 mx-auto">
        <Swiper
          autoplay={{
            delay: 4000,
          }}
          slidesPerView={1}
          loop={true}
          grabCursor={true}
          pagination={{
            clickable: true,
          }}
        >
          {data.map((item) => (
            <SwiperSlide style={{ maxWidth: "100%" }} key={item._id}>
              <div className="aspect-[23/8]">
                <img
                  src={item}
                  className="w-full h-full object-contain mx-auto"
                  alt="slide"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturingCarousel;

import React, { useEffect, useState, useRef } from "react";
import { register } from "swiper/element/bundle";
import PropTypes from "prop-types";

export function Swiper(props) {
  const swiperRef = useRef(null);
  const {
    children,
    virtual, // specify virtual prop
    ...rest
  } = props;

  // store virtual data
  const [virtualData, setVirtualData] = useState({
    from: 0,
    to: 0,
    offset: 0,
    slides: [],
  });

  useEffect(() => {
    // Register Swiper web component
    register();

    // pass component props to parameters
    const params = {
      ...rest,
    };

    // if we have virtual prop passed add virtual prameters
    if (virtual) {
      params.virtual = {
        enabled: true,
        // pass component children (slides) in `slides` array
        slides: children,
        // set virtual data on renderExternal
        renderExternal(vd) {
          setVirtualData(vd);
        },
      };
    }

    // Assign it to swiper element
    Object.assign(swiperRef.current, params);

    // initialize swiper
    swiperRef.current.initialize();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // calc slides to render
  const slides = virtual
    ? virtualData.slides.map((slide, index) =>
        // clone slide
        React.cloneElement(slide, {
          // add key
          key: virtualData.from + index,
          // set slides offset
          style: {
            [props.direction === "vertical" ? "top" : "left"]:
              virtualData.offset,
          },
          // add and swiper slide index to data attribute
          ["data-swiper-slide-index"]: virtualData.from + index,
        })
      )
    : children; // return children if virtual is disabled

  return (
    <swiper-container init="false" ref={swiperRef}>
      {slides}
    </swiper-container>
  );
}

// SwiperSlide component stays the same
export function SwiperSlide(props) {
  const { children, ...rest } = props;

  return <swiper-slide {...rest}>{children}</swiper-slide>;
}

Swiper.propTypes = {
  children: PropTypes.node.isRequired,
  virtual: PropTypes.bool,
  direction: PropTypes.string,
  // Add other props as needed
};

SwiperSlide.propTypes = {
  children: PropTypes.node.isRequired,
  // Add other props as needed
};

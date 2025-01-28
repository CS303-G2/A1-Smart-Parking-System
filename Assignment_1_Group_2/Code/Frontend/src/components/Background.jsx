import Lottie from "lottie-react";
import main from "../../public/main.json";
import PropTypes from 'prop-types';

function Background({brightness, opacity}) {
  return (
    <Lottie
      animationData={main}
      loop={true}
      style={{
        opacity: opacity || 0.9,
        filter: `brightness(${brightness || 0.7})`,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1, // This ensures it stays behind other elements
      }}
    />
  );
}

Background.propTypes = {
  brightness: PropTypes.number
};

export default Background;

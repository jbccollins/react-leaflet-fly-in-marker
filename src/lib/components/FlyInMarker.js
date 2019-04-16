import React from "react";
import PropTypes from "prop-types";
import { renderToStaticMarkup } from "react-dom/server";
import { Marker } from "react-leaflet";
import { divIcon } from "leaflet";
import { Spring } from "react-spring/renderprops";
import "./FlyInMarker.css";

function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

class AnimatedMarker extends React.Component {
  render() {
    const {
      animating,
      fromX,
      fromY,
      toX,
      toY,
      style,
      onAnimationComplete,
      children,
      config
    } = this.props;
    return (
      <Spring
        config={config}
        onRest={() => onAnimationComplete(this.elt)}
        from={{
          coors: [fromX, fromY]
        }}
        to={{
          coords: animating ? [toX, toY] : [fromX, fromY]
        }}
      >
        {({ coords }) => (
          <div
            ref={r => (this.elt = r)}
            className="AnimatedMarker"
            style={{
              ...style,
              position: "absolute",
              zIndex: 10000,
              transform: `translate(${coords[0]}px,${coords[1]}px)`
            }}
          >
            {children}
          </div>
        )}
      </Spring>
    );
  }
}

AnimatedMarker.propTypes = {
  toX: PropTypes.number.isRequired,
  fromX: PropTypes.number.isRequired,
  toY: PropTypes.number.isRequired,
  fromY: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  animating: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired
};

AnimatedMarker.defaultProps = {
  toX: 0,
  fromX: 0,
  toY: 0,
  fromY: 0,
  style: {
    width: "30px",
    height: "30px",
    color: "red"
  },
  animating: false,
  config: {}
};

class FlyInMarker extends React.Component {
  state = {
    mounted: false,
    animating: false,
    animationComplete: false,
    fromX: 0,
    fromY: 0,
    toX: 500,
    toY: 500
  };

  triggerAnimation = () => {
    this.setState({ animating: true });
  };

  handleAnimationComplete = elt => {
    this.setState({ animationComplete: true });
  };

  getHtml = () => {
    const { generateMarkerContent, iconSize } = this.props;
    return renderToStaticMarkup(
      <AnimatedMarker
        animating={false}
        style={{ width: `${iconSize[0]}px`, height: `${iconSize[1]}px` }}
      >
        {generateMarkerContent()}
      </AnimatedMarker>
    );
  };

  componentDidMount() {
    const { iconSize } = this.props;
    const { left, top } = offset(this.markerRef.leafletElement._icon);
    this.setState({
      mounted: true,
      fromX: left,
      fromY: 0 - iconSize[1],
      toX: left,
      toY: top
    });
    setTimeout(this.triggerAnimation, 0);
  }

  render() {
    const { iconSize, generateMarkerContent, springConfig } = this.props;
    const {
      mounted,
      animating,
      animationComplete,
      fromX,
      fromY,
      toX,
      toY
    } = this.state;
    const icon = divIcon({
      className: `FlyInMarker${animationComplete ? "" : " hidden"}`,
      iconSize: iconSize,
      html: this.getHtml()
    });
    const toReturn = [
      <Marker
        ref={r => (this.markerRef = r)}
        key="permanent-marker"
        {...this.props}
        icon={icon}
      />
    ];
    if (mounted && !animationComplete) {
      toReturn.push(
        <AnimatedMarker
          config={springConfig}
          key="temp-marker"
          animating={animating}
          fromX={fromX}
          fromY={fromY}
          toX={toX}
          toY={toY}
          style={{ width: `${iconSize[0]}px`, height: `${iconSize[1]}px` }}
          onAnimationComplete={this.handleAnimationComplete}
        >
          {generateMarkerContent()}
        </AnimatedMarker>
      );
    }
    return toReturn;
  }
}

FlyInMarker.propTypes = {
  iconSize: PropTypes.array.isRequired,
  springConfig: PropTypes.object.isRequired,
  generateMarkerContent: PropTypes.func.isRequired
};

FlyInMarker.defaultProps = {
  springConfig: { friction: 10, clamp: true }
};

export default FlyInMarker;

import React from "react";
import { Map, TileLayer } from "react-leaflet";
import FlyInMarker from "../lib";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

// https://github.com/PaulLeCam/react-leaflet/issues/255#issuecomment-269750542
// The webpack bundling step can't find these images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

//  Workaround for 1px lines appearing in Chrome due to fractional transforms
//  and resulting anti-aliasing.
//  https://github.com/Leaflet/Leaflet/issues/3575
if (window.navigator.userAgent.indexOf("Chrome") > -1) {
  var originalInitTile = L.GridLayer.prototype._initTile;
  L.GridLayer.include({
    _initTile: function(tile) {
      originalInitTile.call(this, tile);
      var tileSize = this.getTileSize();
      tile.style.width = tileSize.x + 1 + "px";
      tile.style.height = tileSize.y + 1 + "px";
    }
  });
}

function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

class App extends React.Component {
  state = {
    randomizationIteration: 0,
    markers: []
  };
  randomizeMarkers = () => {
    const { randomizationIteration } = this.state;
    const latitudeRange = [38.5, 39.5];
    const longitudeRange = [-77.8, -76.5];
    const delayRange = [0, 2000];
    const markers = [];
    for (let i = 0; i < 15; i++) {
      const lat = getRandomInRange(latitudeRange[0], latitudeRange[1]);
      const lng = getRandomInRange(longitudeRange[0], longitudeRange[1]);
      const delay = getRandomInRange(delayRange[0], delayRange[1]);
      markers.push({
        key: `${i}-${randomizationIteration}`,
        lat,
        lng,
        delay,
        color:
          "#" +
          (
            "000000" +
            Math.random()
              .toString(16)
              .slice(2, 8)
              .toUpperCase()
          ).slice(-6)
      });
    }
    this.setState({
      markers,
      randomizationIteration: randomizationIteration + 1
    });
  };
  componentDidMount() {
    this.randomizeMarkers();
  }
  generateMarkerContent = color => {
    return (
      <div className="custom-marker">
        <svg
          height="30px"
          width="30px"
          viewBox="0 0 12 16"
          transform="rotate(180)"
        >
          <path
            fill={color}
            stroke="black"
            strokeWidth="0.5"
            strokeLinejoin="miter"
            d="M 6 1 c -2 3 -5 5 -5 9
                  0 7 10 7 10 0 
                  0 -4 -3 -6 -5 -9z"
          />
        </svg>
      </div>
    );
  };
  render() {
    const { markers } = this.state;
    return (
      <div className="App">
        <Map center={[38.9072, -77.0369]} zoom={9}>
          <TileLayer
            className="MapboxTileLayer"
            crossOrigin
            url={`https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png`}
          />
          {markers.map(({ key, lat, lng, color, delay }) => {
            return (
              <FlyInMarker
                key={key}
                position={[lat, lng]}
                iconSize={[30, 30]}
                springConfig={{ tension: 120, friction: 14, delay }}
                generateMarkerContent={() => this.generateMarkerContent(color)}
              />
            );
          })}
        </Map>
        <button className="randomize-button" onClick={this.randomizeMarkers}>
          Generate Random Markers
        </button>
      </div>
    );
  }
}

export default App;
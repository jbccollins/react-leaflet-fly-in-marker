# react-leaflet-fly-in-marker

[![NPM](https://img.shields.io/npm/v/react-leaflet-fly-in-marker.svg)](https://www.npmjs.com/package/react-leaflet-fly-in-marker)

This packages provides a wrapper for leaflet markers allowing you to animate them in a similar way to [google maps icons](https://developers.google.com/maps/documentation/javascript/examples/marker-animations).

The animation part of this relies on [react-spring](https://github.com/react-spring/react-spring)

<img src="readme_images/fly-in-markers.gif" alt="basic">

## Usage

```jsx
import FlyInMarker from 'react-leaflet-fly-in-marker';

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

// and in the render:

<FlyInMarker
    key={key}
    position={[lat, lng]}
    iconSize={[30, 30]}
    // See react-spring documentation for config options
    springConfig={{ tension: 120, friction: 14, : 500 }}
    generateMarkerContent={() => this.generateMarkerContent("red")}
/>
```

See the demo directory for a full app using this

## Attribution
This is based off of https://github.com/DimiMikadze/create-react-library
Check it out for more goodies!

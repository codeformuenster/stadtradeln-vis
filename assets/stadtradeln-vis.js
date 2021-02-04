const yearMax = {
  2018: 581,
  2019: 1123,
  2020: 19212,
};
let selectedYear = "2018";

const tilesBaseDomain = window.location.origin;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/dark-v10",
  maxZoom: 22,
  minZoom: 8,
  maxBounds: [7.3, 51.6, 8, 52.1],
  bounds: [7.6, 51.98, 7.65, 51.94], //initial bounds
});

map.addControl(new mapboxgl.NavigationControl(), "top-right");

const spinnerHandler = function (e) {
  if (e.isSourceLoaded && e.sourceId === "stadtradeln") {
    document.getElementById("spinner-container").style.display = "none";
    map.off("sourcedata", spinnerHandler);
  }
};
map.on("sourcedata", spinnerHandler);

map.on("load", function () {
  map.addSource("stadtradeln", {
    type: "vector",
    bounds: [7.5, 51.8, 7.8, 52.01], // [sw.lng, sw.lat, ne.lng, ne.lat]
    maxzoom: 14,
    tiles: [tilesBaseDomain + "/assets/tiles/{z}/{x}/{y}.pbf"],
    attribution:
      '<a target="_blank" rel="noopener" href=' +
      '"https://www.mcloud.de/web/guest/suche/-/results/detail/3096DB7A-9EE4-4C14-B2AA-79E33A7FFF01"' +
      ">Stadtradeln Data CC-BY-NC</a>",
  });

  const buttonsElement = document.getElementById("buttons");

  const onYearChange = function () {
    Object.getOwnPropertyNames(yearMax).forEach(function (year) {
      const layerID = "stadtradeln-heat-" + year;
      const elem = document.getElementById(layerID);
      if (elem && elem.checked) {
        map.setLayoutProperty(layerID, "visibility", "visible");
        selectedYear = year;
      } else {
        map.setLayoutProperty(layerID, "visibility", "none");
      }
    });
  };

  Object.getOwnPropertyNames(yearMax).forEach(function (year) {
    const layerID = "stadtradeln-heat-" + year;
    const isSelected = year === selectedYear;

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.id = layerID;
    radio.value = layerID;
    radio.name = "stadtradeln";
    radio.checked = isSelected;
    radio.addEventListener('change', onYearChange);
    buttonsElement.appendChild(radio);

    const label = document.createElement("label");
    label.setAttribute("for", layerID);
    label.textContent = year;
    buttonsElement.appendChild(label);

    map.addLayer(
      {
        id: layerID,
        type: "heatmap",
        source: "stadtradeln",
        "source-layer": "heatmap_" + year,
        maxzoom: 21,
        layout: {
          visibility: isSelected ? "visible" : "none",
        },
        paint: {
          // Increase the heatmap weight based on count
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "c"],
            0,
            0,
            yearMax[year],
            1,
          ],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            9,
            3,
          ],
          // Color ramp for heatmap. Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color
          // to create a blur-like effect.
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(178,24,43)",
          ],
          // Adjust the heatmap radius by zoom level
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
        },
      },
      "waterway-label"
    );
  });
});

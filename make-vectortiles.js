import { featureCollection, point } from "@turf/helpers";
import { readFile, writeFile } from "fs/promises";
import geojson2mvt from "./geojson2mvt/index.js";

const years = [2018, 2019, 2020];

const precision = 6;

const convert = async (year) => {
  const csv = await readFile(`./heatmap_${year}_ms.csv`);

  const lines = csv.toString().split("\n");

  const features = [];

  let max = 0;

  let skipFirst = true;
  for (const line of lines) {
    if (skipFirst) {
      skipFirst = false;
      continue;
    }
    const [strLon, strLat, strCount] = line.split(",");
    const lon = parseFloat(strLon);
    const lat = parseFloat(strLat);
    const count = parseFloat(strCount);


    if (lon) {
      max = Math.max(count, max);
      features.push(point([1 * lon.toFixed(precision), 1* lat.toFixed(precision)], { c: count }));
    }
  }

  console.log({ year, max, numFeatures: features.length })

  writeFile(`./heatmap_${year}.geojson`, JSON.stringify(featureCollection(features)));
  return featureCollection(features);
}

const convertAll = async () => {
  return Promise.all(years.map(item => convert(item)))
}

const layers = await convertAll();

console.log('done converting');

var options = {
  layers: {
    "heatmap_2018": layers[0],
    "heatmap_2019": layers[1],
    "heatmap_2020": layers[2],
  },
  rootDir: 'assets/tiles',
  zoom : {
    min : 9, // do not create tile files below this zoom level
    max : 14, // to not create above this zoom level
  }
};

// build the static tile pyramid
await geojson2mvt(options);

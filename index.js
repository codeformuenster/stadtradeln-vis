import { featureCollection, point } from "@turf/helpers";
import { readFile, writeFile } from "fs/promises";

const years = [2018, 2019, 2020];

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
      features.push(point([lon, lat], { count }));
    }
  }

  console.log({ year, max, numFeatures: features.length })

  writeFile(`./heatmap_${year}.geojson`, JSON.stringify(featureCollection(features)));
}

years.forEach(convert);

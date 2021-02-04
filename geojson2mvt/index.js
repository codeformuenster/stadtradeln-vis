import { mkdir, writeFile } from "fs/promises";
import { fromGeojsonVt } from "vt-pbf";
import geojsonvt from "geojson-vt";

const getTile = (z, x, y, tileIndex, layerNames) => {
  const pbfOptions = {};

  let createdTile = false;
  for (var i = 0, ii = tileIndex.length; i < ii; ++i) {
    const tile = tileIndex[i].getTile(z, x, y);

    if (tile != null) {
      pbfOptions[layerNames[i]] = tile;
      createdTile = true;
    }
  }

  if (!createdTile) {
    return null;
  }

  return fromGeojsonVt(pbfOptions, { version: 2 });
};

const geojson2mvt = async ({ layers, rootDir, zoom: { max, min } }) => {
  const layerNames = Object.keys(layers);
  const numLayers = layerNames.length;
  const tileCoords = new Set();
  const tileIndex = new Array(numLayers);

  for (let i = 0; i < numLayers; ++i) {
    tileIndex[i] = geojsonvt(layers[layerNames[i]], {
      maxZoom: max,
      indexMaxZoom: max,
      indexMaxPoints: 0,
    });
    tileIndex[i].tileCoords.forEach(({ z, x, y }) =>
      tileCoords.add(`${z}-${x}-${y}`)
    );
  }

  let tileCount = 0;

  for (const tileCoordStr of tileCoords) {
    const [zStr, xStr, yStr] = tileCoordStr.split("-");

    const z = parseInt(zStr, 10);

    if (z < min) {
      continue;
    }

    const x = parseInt(xStr, 10);
    const y = parseInt(yStr, 10);

    const tilePath = `${rootDir}/${zStr}/${xStr}`;

    try {
      await mkdir(tilePath, { recursive: true });
    } catch (err) {
      if (err.code !== "EEXIST") {
        throw err;
      }
    }

    const mvt = getTile(z, x, y, tileIndex, layerNames);

    if (mvt !== null) {
      await writeFile(`${tilePath}/${y}.pbf`, mvt);
      tileCount++;
    }
  }

  console.log("Done! I made " + tileCount + " tiles!");
};

export default geojson2mvt;

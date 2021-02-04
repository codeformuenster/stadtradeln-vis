# Stadtradeln Münster

## Obtain Data

Download at: https://www.mcloud.de/web/guest/suche/-/results/detail/3096DB7A-9EE4-4C14-B2AA-79E33A7FFF01

### Data License

```
Quellenvermerk: Grubitzsch P., Lißner S., Huber S., Springer T., [2021] Technische Universität Dresden, Professur für Rechnernetze und Professur für Verkehrsökologie
```

[Creative Commons Attribution - NonCommercial (CC BY-NC)](https://creativecommons.org/licenses/by-nc/)

## Extract Münster

```
grep -E "7\.[5-8].*,(51\.(8|9)|52\.0[01])" heatmap_2019.csv > heatmap_2019_ms.csv
```

## Convert to geojson & vector tiles

```
npm install
node index.js
```

## Prepare visualization

- Execute `node make-vectortiles.js` to generate the tiles
- Obtain mapbox token and set it in `index.html` (`mapboxgl.accessToken =...`
- Change the `var selectedYear = "...` to the year you want to show

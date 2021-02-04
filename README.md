# Stadtradeln Münster

The page is available at [https://codeformuenster.org/stadtradeln-vis](https://codeformuenster.org/stadtradeln-vis)

Uses

- mapbox technology (mapbox-gl-js, geojson-vt, vt-pbf)
- svg spinner from https://github.com/SamHerbert/SVG-Loaders
- OpenStreetMap Data as base map data
- Stadtradeln Data

## Screenshots

 <details open>

<summary>2018</summary>

![2018](https://user-images.githubusercontent.com/1494211/106954201-bf92e400-6733-11eb-967a-a9f885420d8a.png)

</details>

<details>

<summary>2019</summary>

![2019](https://user-images.githubusercontent.com/1494211/106954229-c91c4c00-6733-11eb-9172-4a4897d4dc42.png)

</details>

<details>

<summary>2020</summary>

![2020](https://user-images.githubusercontent.com/1494211/106954223-c7eb1f00-6733-11eb-8b08-b385f53fc761.png)

</details>

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

/* global L Papa */

/*
 * Script to display two tables from Google Sheets as point and polygon layers using Leaflet
 * The Sheets are then imported using PapaParse and overwrite the initially laded layers
 */

// init() is called as soon as the page loads
function init() {
  // PASTE YOUR URLs HERE
  // these URLs come from Google Sheets 'shareable link' form
  // the first is the polygon layer and the second the points
  let polyURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTsAyA0Hpk_-WpKyN1dfqi5IPEIC3rqEiL-uwElxJpw_U7BYntc8sDw-8sWsL87JCDU4lVg2aNi65ES/pub?output=csv";
  let pointsURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFQw9sVY16eQmN5TIjOH7CUaxeZnl_v6LcdE2goig1pSe9I3hipeOn1sOwmC4fS0AURefRWwcKExct/pub?output=csv";

  Papa.parse(polyURL, {
    download: true,
    header: true,
    complete: addPolygons,
  });
  Papa.parse(pointsURL, {
    download: true,
    header: true,
    complete: addPoints,
  });
}
window.addEventListener("DOMContentLoaded", init);

// Create a new Leaflet map centered on the continental US
let map = L.map("map").setView([40, -100], 4);

// This is the Carto Positron basemap
let basemap = L.tileLayer(
  "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='http://cartodb.com/attributions'>CartoDB</a>",
    subdomains: "abcd",
    maxZoom: 19,
  }
);
basemap.addTo(map);

let sidebar = L.control
  .sidebar({
    container: "sidebar",
    closeButton: true,
    position: "right",
  })
  .addTo(map);

let panelID = "my-info-panel";
let panelContent = {
  id: panelID,
  tab: "<i class='fa fa-bars active'></i>",
  pane: "<p id='sidebar-content'></p>",
  title: "<h2 id='sidebar-title'>No state selected</h2>",
};
sidebar.addPanel(panelContent);

map.on("click", function () {
  sidebar.close(panelID);
});

// These are declared outisde the functions so that the functions can check if they already exist
let polygonLayer;
let pointGroupLayer;

// The form of data must be a JSON representation of a table as returned by PapaParse
// addPolygons first checks if the map layer has already been assigned, and if so, deletes it and makes a fresh one
// The assumption is that the locally stored JSONs will load before PapaParse can pull the external data from Google Sheets
function addPolygons(data) {
  data = data.data;
  if (polygonLayer != null) {
    // If the layer exists, remove it and continue to make a new one with data
    polygonLayer.remove();
  }

  // Need to convert the PapaParse JSON into a GeoJSON
  // Start with an empty GeoJSON of type FeatureCollection
  // All the rows will be inserted into a single GeoJSON
  let geojsonStates = {
    type: "FeatureCollection",
    features: [],
  };

  for (let row in data) {
    // The Sheets data has a column 'include' that specifies if that row should be mapped
    if (data[row].include == "y") {
      let coords = JSON.parse(data[row].geometry);

      geojsonStates.features.push({
        type: "Feature",
        geometry: {
          type: "MultiPolygon",
          coordinates: coords,
        },
        properties: {
          name: data[row].name,
          summary: data[row].summary,
          state: data[row].state,
          local: data[row].local,
        },
      });
    }
  }

  // The polygons are styled slightly differently on mouse hovers
  let polygonStyle = { color: "#2ca25f", fillColor: "#99d8c9", weight: 1.5 };
  let polygonHoverStyle = { color: "green", fillColor: "#2ca25f", weight: 3 };

  polygonLayer = L.geoJSON(geojsonStates, {
    onEachFeature: function (feature, layer) {
      layer.on({
        mouseout: function (e) {
          e.target.setStyle(polygonStyle);
        },
        mouseover: function (e) {
          e.target.setStyle(polygonHoverStyle);
        },
        click: function (e) {
          // This zooms the map to the clicked polygon
          // map.fitBounds(e.target.getBounds());

          // if this isn't added, then map.click is also fired!
          L.DomEvent.stopPropagation(e);

          document.getElementById("sidebar-title").innerHTML =
            e.target.feature.properties.name;
          document.getElementById("sidebar-content").innerHTML =
            e.target.feature.properties.summary;
          sidebar.open(panelID);
        },
      });
    },
    style: polygonStyle,
  }).addTo(map);
}

// addPoints is a bit simpler, as no GeoJSON is needed for the points
// It does the same check to overwrite the existing points layer once the Google Sheets data comes along
function addPoints(data) {
  data = data.data;
  if (pointGroupLayer != null) {
    pointGroupLayer.remove();
  }
  pointGroupLayer = L.layerGroup().addTo(map);

  // Choose marker type. Options are:
  // (these are case-sensitive, defaults to marker!)
  // marker: standard point with an icon
  // circleMarker: a circle with a radius set in pixels
  // circle: a circle with a radius set in meters
  let markerType = "marker";

  // Marker radius
  // Wil be in pixels for circleMarker, metres for circle
  // Ignore for point
  let markerRadius = 100;

  for (let row = 0; row < data.length; row++) {
    let marker;
    if (markerType == "circleMarker") {
      marker = L.circleMarker([data[row].lat, data[row].lon], {
        radius: markerRadius,
      });
    } else if (markerType == "circle") {
      marker = L.circle([data[row].lat, data[row].lon], {
        radius: markerRadius,
      });
    } else {
      marker = L.marker([data[row].lat, data[row].lon]);
    }
    marker.addTo(pointGroupLayer);

    // UNCOMMENT THIS LINE TO USE POPUPS
    //marker.bindPopup('<h2>' + data[row].location + '</h2>There's a ' + data[row].level + ' ' + data[row].category + ' here');

    // COMMENT THE NEXT 14 LINES TO DISABLE SIDEBAR FOR THE MARKERS
    marker.feature = {
      properties: {
        location: data[row].location,
        category: data[row].category,
      },
    };
    marker.on({
      click: function (e) {
        L.DomEvent.stopPropagation(e);
        document.getElementById("sidebar-title").innerHTML =
          e.target.feature.properties.location;
        document.getElementById("sidebar-content").innerHTML =
          e.target.feature.properties.category;
        sidebar.open(panelID);
      },
    });

    // AwesomeMarkers is used to create fancier icons
    let icon = L.AwesomeMarkers.icon({
      icon: "info-circle",
      iconColor: "white",
      markerColor: getColor(data[row].category),
      prefix: "fa",
      extraClasses: "fa-rotate-0",
    });
    if (!markerType.includes("circle")) {
      marker.setIcon(icon);
    }
  }
}

// Returns different colors depending on the string passed
// Used for the points layer
/*eslint indent: [2, 2, {"SwitchCase": 1}]*/
function getColor(type) {
  switch (type) {
    case "Coffee Shop":
      return "green";
    case "Restaurant":
      return "blue";
    default:
      return "green";
  }
}

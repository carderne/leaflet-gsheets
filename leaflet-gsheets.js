var statesURL = "https://docs.google.com/spreadsheets/d/1p9pdXDgaLLVFj1agny5m1Y5gHSeRYJP-K0hrENLkfJo/edit?usp=sharing";
var lawsURL = "https://docs.google.com/spreadsheets/d/1WyZNokrgj5NmbyYrRIOQDa2mZ0_SEdbjBohR2RmKXp8/edit?usp=sharing";

function init() {
    Tabletop.init( { key: lawsURL,
                     callback: addPoints,
                     simpleSheet: true } );
    Tabletop.init( { key: statesURL,
                     callback: addPolygons,
                     simpleSheet: true } );
}

window.addEventListener("DOMContentLoaded", init);

var map = L.map("map").setView([40, -100], 4);

var basemap = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
});
basemap.addTo(map);

function addPolygons(data, tabletop) {
	var geojsonStates = {
	    "type": "FeatureCollection",
	    "features": []
  	};

  	for (var row in data) {
    	if (data[row].include == "y") {
      		var coords = JSON.parse(data[row].geometry);

	    	geojsonStates.features.push({
	        	"type": "Feature",
	        	"geometry": {
	          		"type": "MultiPolygon",
	          		"coordinates": coords
	        	},
	        	"properties": {
	          		"name": data[row].name,
	          		"summary": data[row].summary,
	          		"state": data[row].state,
	          		"local": data[row].local,
	        	}
	    	});
    	}
  	}

  	var poylgonStyle = {"color": "#2ca25f", "fillColor": "#99d8c9", "weight": 1.5};
	var polygonHoverStyle = {"color": "green", "fillColor": "#2ca25f", "weight": 3};

  	L.geoJSON(geojsonStates, {
    	onEachFeature: function (feature, layer) {
      		layer.bindPopup("<h2>"+feature.properties.name+"</h2><p>"+feature.properties.summary+"</p>");
      		layer.on({
      			mouseout: function(e) {
                    e.target.setStyle(poylgonStyle);
                },
                mouseover: function(e) {
                    e.target.setStyle(polygonHoverStyle);
                },
                click: function(e) {
                    //map.fitBounds(e.target.getBounds());
                }
      		});
    	},
    	style: poylgonStyle
  	}).addTo(map);
}

function addPoints(data, tabletop) {
	for(var row = 0; row < data.length; row++) {
    	var marker = L.marker([data[row].lat, data[row].long]).addTo(map);
      	marker.bindPopup("<h2>"+data[row].location+"</h2>"+data[row].category+" regulations at "+data[row].level+" level");

      	var icon = L.AwesomeMarkers.icon({
			icon: "info-sign",
			iconColor: "white",
			markerColor: getColor(data[row].category),
			prefix: "glyphicon",
			extraClasses: "fa-rotate-0"
		});
    	marker.setIcon(icon);

  	}
}

function getColor(type) {
	switch (type) {
		case "Bag Ban":
			return "green";
		case "Recycling":
			return "blue";
		default:
			return "green";

	}
}
var states_url = 'https://docs.google.com/spreadsheets/d/1p9pdXDgaLLVFj1agny5m1Y5gHSeRYJP-K0hrENLkfJo/edit?usp=sharing';
var laws_url = 'https://docs.google.com/spreadsheets/d/1WyZNokrgj5NmbyYrRIOQDa2mZ0_SEdbjBohR2RmKXp8/edit?usp=sharing'

function init() {
    Tabletop.init( { key: laws_url,
                     callback: add_points,
                     simpleSheet: true } )
    Tabletop.init( { key: states_url,
                     callback: add_polygons,
                     simpleSheet: true } )
}

window.addEventListener('DOMContentLoaded', init)

var map = L.map('map').setView([40, -100], 4);

var basemap = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
	"attribution": null,
	"detectRetina": false,
	"maxZoom": 18,
	"minZoom": 1,
	"noWrap": false,
	"subdomains": "abc"
}).addTo(map);

function add_polygons(data, tabletop) {
	var geojson_states = {
	    "type": "FeatureCollection",
	    "features": []
  	}

  	for (var row in data) {
    	if (data[row]["include"] == "y") {
      		var coords = JSON.parse(data[row]["geometry"]);

	    	geojson_states.features.push({
	        	"type": "Feature",
	        	"geometry": {
	          		"type": "MultiPolygon",
	          		"coordinates": coords
	        	},
	        	"properties": {
	          		"name": data[row]["name"],
	          		"summary": data[row]["summary"],
	          		"state": data[row]["state"],
	          		"local": data[row]["local"],
	        	}
	    	});
    	}
  	}

  	polygon = L.geoJSON(geojson_states, {
    	onEachFeature: function (feature, layer) {
      		layer.bindPopup('<h2>'+feature.properties.name+'</h2><p>'+feature.properties.summary+'</p>');
    	},
    	style: {"color": "#2ca25f", "fillColor": "#99d8c9", "weight": 1.5}
  	}).addTo(map);
}

function add_points(data, tabletop) {
	for (var row in data) {
    	var marker = L.marker([data[row]["lat"], data[row]["long"]]).addTo(map);
      	marker.bindPopup('<h2>'+data[row]["location"]+'</h2>'+data[row]["category"]+' ban at '+data[row]["level"]+' level');

      	var icon = L.AwesomeMarkers.icon({
			icon: 'info-sign',
			iconColor: 'white',
			markerColor: getColor(data[row]["category"]),
			prefix: 'glyphicon',
			extraClasses: 'fa-rotate-0'
		});
    	marker.setIcon(icon);

  	}
}

function getColor(type) {
	switch (type) {
		case "Bag Ban":
			return 'green'
			break;
		case "Recycling":
			return 'blue'
			break;
		default:
			return 'green'

	}
}
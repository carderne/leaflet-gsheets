var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1lkplzeWlgSPuHp58fUBtT0YKH-I-tn0A3xW7KdFQcFk/edit?usp=sharing';
function init() {
    Tabletop.init( { key: publicSpreadsheetUrl,
                     callback: showInfo,
                     simpleSheet: true } )
}

function showInfo(data, tabletop) {

    var points_geojson = {
    	"id": "points",
    	"type": "symbol",
    	"layout": {
    		"icon-image": "{icon}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
    	},
    	"source": {
			"type": "geojson",
			"data": {
				"type": "FeatureCollection",
				"features": []
			}
    	}
	}

	for (var row in data) {
		points_geojson.source.data.features.push({
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [data[row]["long"], data[row]["lat"]]
			},
			"properties": {
				"title": data[row]["name"],
				"icon": "monument"
			}
		});
	}

	create_map(points_geojson)
    console.log(points_geojson)
}
window.addEventListener('DOMContentLoaded', init)

mapboxgl.accessToken = 'pk.eyJ1IjoiY2FyZGVybmUiLCJhIjoiY2puZnE3YXkxMDBrZTNrczI3cXN2OXQzNiJ9.2BDgu40zHwh3CAfHs6reAQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [12, 41],
    zoom: 4
});

map.on('load', function () {});

function create_map(points_geojson) {
    map.addLayer(points_geojson);
}
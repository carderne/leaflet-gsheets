# leaflet-gsheets


### ⚠️ Note for people who've forked this in the past
This previously used [Tabletop.js](https://github.com/jsoma/tabletop) but apparently it will stop working in September 2020 (thanks Google), so I've switched this repo over to [PapaParse](https://github.com/mholt/PapaParse). Anyone using the old code should try to switch over!

### For new people, nothing to worry about! 👍
How to create a simple [Leaflet](https://leafletjs.com/) web map that automatically pulls data from two simple Google Sheets tables. Sidebar created using [leaflet-sidebar-v2](https://github.com/nickpeihl/leaflet-sidebar-v2), and Google Sheets connection with [PapaParse](https://github.com/mholt/PapaParse).

The resultant map can be seen here: [https://rdrn.me/leaflet-gsheets/](https://rdrn.me/leaflet-gsheets/)

I explained the process in more length in my blog post here: [Leaflet maps with data from Google Sheets](https://rdrn.me/leaflet-maps-google-sheets/).

![example](example.png)

## Steps
1. Open the following two Google Sheets and copy them to your account (top left, "Add to My Drive")
    - [leaflet_geoms](https://docs.google.com/spreadsheets/d/1EUFSaqi30b6oefK0YWWNDDOzwmCTTXlXkFHAc2QrUxM/edit?usp=sharing)
    - [leaflet_points](https://docs.google.com/spreadsheets/d/1kjJVPF0LyaiaDYF8z_x23UulGciGtBALQ1a1pK0coRM/edit?usp=sharing)
2. In each one, do the following three steps:
   - In Google Sheets, go to File -> Publish to the Web -> Publish
   - Choose "Comma-separated values (.csv)" in the dropdown on the right
   - Then copy the link provided just underneath, and save it somewhere
3. Back in GitHub, Fork this repo (top right of this page)
4. Either clone/download your new repo to your machine, or use GitHub's built-in code editor, and open [leaflet-gsheets.js](leaflet-gsheets.js)
5. At line 20 where it says "PASTE YOUR URLs HERE", paste the URLs you copied above
6. If you want to display your new website using [GitHub Pages](https://pages.github.com/):
    - Click Settings -> go down to GitHub Pages -> under Source choose master branch
    - It may take a while, but the site should become available at [your-username.github.io/leaflet-gsheets](https://your-username.github.io/leaflet-gsheets)
7. Customise the Google Sheets with the data you want
8. Customise the JavaScript however you want, there are comments to show where to comment/uncomment code to enable/disable features.

## Adding geometry data
In the [leaflet_geoms](https://docs.google.com/spreadsheets/d/1EUFSaqi30b6oefK0YWWNDDOzwmCTTXlXkFHAc2QrUxM/edit?usp=sharing) sheet, the geometry column contains the [GeoJSON](https://geojson.org/) representation of each... geometry. If you're getting this from a `.geojson` file, you only need to include the `geometry` part (at some points I'll work on making `leaflet-gsheets` a bit more flexible. This can be a point, line, polygon, or 'multi' version of any of these.

A good website to use to make these geometries is [geojson.io](http://geojson.io) and a good place to find and download geometries for standard things (continents, countries and whatnot) is [geojson.xyz](http://geojson.xyz/).

An example of a line with two segments/three points. Note that the 'front-matter' about type, FeatureCollection, properties etc has been left out.
```
{
    "type": "LineString",
    "coordinates": [
        [0.70, 41.9],
        [4.57, 17.3],
        [26.0, 28.1]
    ]
}
```

## Parting notes

Get in touch if you need a hand!

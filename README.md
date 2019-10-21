# leaflet-gsheets

How to create a simple [Leaflet](https://leafletjs.com/) web map that automatically pulls data from two simple Google Sheets tables. Sidebar created using [leaflet-sidebar-v2](https://github.com/nickpeihl/leaflet-sidebar-v2), and Google Sheets connection with [Tabletop.js](https://github.com/jsoma/tabletop).

To get started, fork this repo and make copies of the following two Google Sheets:
- [Polys](https://docs.google.com/spreadsheets/d/1EUFSaqi30b6oefK0YWWNDDOzwmCTTXlXkFHAc2QrUxM/edit?usp=sharing)
- [Points](https://docs.google.com/spreadsheets/d/1kjJVPF0LyaiaDYF8z_x23UulGciGtBALQ1a1pK0coRM/edit?usp=sharing)

You will then need to do three things with each one:
- In Google Sheets, go File -> Publish to the Web -> Publish
- Then click Share in the top right, click Get Shareable Link, ensure "Anyone with the link can view" and copy the link
- Paste this link into [leaflet-gsheets.js](leaflet-gsheets.js) starting at line 20 where it says "PASTE YOUR URLs HERE"

The resultant map can be seen here: [https://rdrn.me/leaflet-gsheets/](https://rdrn.me/leaflet-gsheets/)

I explained the process in more length in my blog post here: [Leaflet maps with data from Google Sheets](https://rdrn.me/leaflet-maps-google-sheets/).

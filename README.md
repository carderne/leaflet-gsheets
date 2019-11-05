# leaflet-gsheets

How to create a simple [Leaflet](https://leafletjs.com/) web map that automatically pulls data from two simple Google Sheets tables. Sidebar created using [leaflet-sidebar-v2](https://github.com/nickpeihl/leaflet-sidebar-v2), and Google Sheets connection with [Tabletop.js](https://github.com/jsoma/tabletop).

The resultant map can be seen here: [https://rdrn.me/leaflet-gsheets/](https://rdrn.me/leaflet-gsheets/)

I explained the process in more length in my blog post here: [Leaflet maps with data from Google Sheets](https://rdrn.me/leaflet-maps-google-sheets/).

## Steps
1. Open the following two Google Sheets and copy them to your account (top left, "Add to My Drive")
    - [Polys](https://docs.google.com/spreadsheets/d/1EUFSaqi30b6oefK0YWWNDDOzwmCTTXlXkFHAc2QrUxM/edit?usp=sharing)
    - [Points](https://docs.google.com/spreadsheets/d/1kjJVPF0LyaiaDYF8z_x23UulGciGtBALQ1a1pK0coRM/edit?usp=sharing)
2. In each one, do the following three steps:
   - In Google Sheets, go to File -> Publish to the Web -> Publish (and then close the dialog)
   - Then click Share in the top right -> Get Shareable Link (ensure "Anyone with the link can view" is enabled)
   - Copy the link provided and keep it aside
3. Back in GitHub, Fork this repo (top right of this page)
4. Either clone/download your new repo to your machine, or use GitHub's built-in code editor, and open [leaflet-gsheets.js](leaflet-gsheets.js)
5. At line 20 where it says "PASTE YOUR URLs HERE", paste the URLs you copied above
6. If you want to display your new website using [GitHub Pages](https://pages.github.com/):
    - Click Settings -> go down to GitHub Pages -> under Source choose master branch
    - It may take a while, but the site should become available at [your-username.github.io/leaflet-gsheets](https://your-username.github.io/leaflet-gsheets)
7. Customise the Google Sheets with the data you want
8. Customise the JavaScript however you want...

Get in touch if you need a hand!

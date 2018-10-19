import numpy as np
import pandas as pd
from shapely.geometry import Point
import folium
import geopandas as gpd
from shapely.wkt import loads
from math import isnan
import gspread
from oauth2client.service_account import ServiceAccountCredentials

wgs84 = {'init': 'epsg:4326'}

scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']
credentials = ServiceAccountCredentials.from_json_keyfile_name('gsheets.json', scope)
gc = gspread.authorize(credentials)

wks_laws = gc.open("environmental-laws").sheet1
val_laws = wks_laws.get_all_values()
laws = pd.DataFrame(val_laws[1:], columns=val_laws[0])

laws = laws.astype({'lat': int, 'long':int})
laws_geom = [Point(xy) for xy in zip(laws['lat'], laws['long'])]
laws = gpd.GeoDataFrame(laws, crs=wgs84, geometry=laws_geom)

wks_states = gc.open("states-folium").sheet1
val_states = wks_states.get_all_values()
states = pd.DataFrame(val_states[1:], columns=val_states[0])
states = states.astype({'Code': str, 'Name': str, 'Summary': str, 'State': str, 'Local': str})

states = gpd.GeoDataFrame(states, crs=wgs84)
states['geometry'] = states['geometry'].apply(lambda x: loads(x))

states_dict = {}
for index, row in states.iterrows():
    states_dict[row['Name']] = {'geom':states['geometry'][index:index+1],
                                'summary': row['Summary'],
                                'state': row['State'],
                                'local': row['Local']}

m = folium.Map([40, -100], zoom_start=4, control_scale=True, tiles='cartodbpositron')

for index, row in laws.iterrows():
    category = row['category']
    location = row['location']
    level = row['level']
    folium.Marker(
        location=[row['lat'], row['long']],
        popup=f'<h3>Category</h3>{category}<h3>Location</h3>{location}<h3>Government level</h3>{level}',
        icon=folium.Icon(color='red', icon='info-sign')
    ).add_to(m)

def style_function(feature):
    return {
        'fillColor': '#99d8c9',
        'color': '#2ca25f',
        'weight': 1.5
    }


def highlight_function(feature):
    return {
        'fillColor': '#2ca25f',
        'color': 'green',
        'weight': 3
    }
    
for key, value in states_dict.items():
    if len(value['summary']) > 0:
        c = folium.GeoJson(
            value['geom'],
            style_function=style_function,
            highlight_function=highlight_function)
        
        summary = value['summary']
        state = value['state']
        local = value['local']
        popup=f'<h3>Summary</h3>{summary}<h3>State laws</h3>{state}<h3>Local laws</h3>{local}'
        
        folium.Popup(popup).add_to(c)
        c.add_to(m)  

m.save('folium-gspread.html')

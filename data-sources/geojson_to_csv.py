// extract GeoJSON geometry and extract to single .CSV column

import re
import pandas as pd

s = open('states.geojson').read()

pattern = re.compile('\"coordinates\": (.*) } }')

coords = []
for m in re.finditer(pattern, s):
    coords.append(m.group(1))   
df = pd.DataFrame(columns=['geometry'],data=coords).to_csv('states_geojson2.csv')
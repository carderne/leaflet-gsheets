"""Convert GeoJSON to CSV with WK."""

import json
import geopandas as gpd
import click


@click.command()
@click.argument("infile")
@click.argument("outfile")
def main(infile, outfile):
    with open(infile) as f:
        gpd.GeoDataFrame(json.load(f)).to_csv(outfile)


if __name__ == "__main__":
    main()

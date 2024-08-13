import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np

# The Purpose of this Class is to separate out any Database logic
class SQLHelper():
    #################################################
    # Database Setup
    #################################################

    # define properties
    def __init__(self):
        self.engine = create_engine("sqlite:///austinHousingData.sqlite")
        # self.Base = None

        # automap Base classes
        # self.init_base()

    # COMMENT BACK IN IF USING THE ORM

    # def init_base(self):
    #     # reflect an existing database into a new model
    #     self.Base = automap_base()
    #     # reflect the tables
    #     self.Base.prepare(autoload_with=self.engine)

    #################################################
    # Database Queries
    #################################################

    # USING RAW SQL
    # Bar Graph for houses with a garage
    def get_bar_garage(self, min_year_built):


        query = f"""
            SELECT
                homeType,
                COUNT(*) AS total_houses,
                SUM(CASE WHEN hasGarage = 1 THEN 1 ELSE 0 END) AS houses_with_garage,
                (SUM(CASE WHEN hasGarage = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS percent_with_garage
            FROM
                austin_housing
            WHERE
                yearBuilt >= {min_year_built}
            GROUP BY
                homeType
            ORDER BY
                percent_with_garage DESC;
        """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    # Bar Graph for houses with heat
    def get_bar_heat(self, min_year_built):


        query = f"""
            SELECT
                homeType,
                COUNT(*) AS total_houses,
                SUM(CASE WHEN hasHeating = 1 THEN 1 ELSE 0 END) AS houses_with_heating,
                (SUM(CASE WHEN hasHeating = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS percent_with_heating
            FROM
                austin_housing
            WHERE
                yearBuilt >= {min_year_built}
            GROUP BY
                homeType
            ORDER BY
                percent_with_heating DESC;
        """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    def get_map(self, min_year_built):

        # build the query
        
        query = f"""
            SELECT
                city,
                latitude,
                longitude,
                yearBuilt,
                latestPrice
            FROM
                austin_housing
            WHERE
                yearBuilt >= {min_year_built}
        """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

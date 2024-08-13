from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
from sqlHelper import SQLHelper

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
sql = SQLHelper()

#################################################
# Flask Routes
#################################################

# HTML ROUTES
@app.route("/")
def index():
    return render_template("home.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

@app.route("/works_cited")
def works_cited():
    return render_template("works_cited.html")

# SQL Queries
@app.route("/api/v1.0/get_dashboard/<min_year_built>")
def get_dashboard(min_year_built):
    min_year_built = int(min_year_built) # cast to int

    bar_garage = sql.get_bar_garage(min_year_built)
    bar_heat = sql.get_bar_heat(min_year_built)
    line_hoa =sql.get_hoa_raw(min_year_built)

    data = {
        "bar_garage": bar_garage,
        "bar_heat": bar_heat,
        "line_hoa": line_hoa,
    }
    return(jsonify(data))

@app.route("/api/v1.0/get_map/<min_year_built>")
def get_map(min_year_built):
    min_year_built = int(min_year_built) # cast to int
    map_data = sql.get_map(min_year_built)

    return(jsonify(map_data))



# Run the App
if __name__ == '__main__':
    app.run(debug=True)

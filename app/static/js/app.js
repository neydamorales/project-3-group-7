function do_work() {
  // extract user input

  let min_year_built = d3.select("#min_year_built_filter").property("value");
  min_year_built = parseInt(min_year_built);

  // We need to make a request to the API
  let url = `/api/v1.0/get_dashboard/${min_year_built}`;
  d3.json(url).then(function (data) {

    // create the graphs
    make_bar1(data.bar_garage);
    make_bar2(data.bar_heat);
    make_line_graph(data.line_hoa)
  });
}
/////////////
function make_line_graph(line_hoa) {

  // Create a map to store traces for each city
  let traces = {};

  // Process the data to create traces
  line_hoa.forEach(line_hoa => {
    let city = line_hoa.city;
    let year = line_hoa.yearBuilt;
    let total = line_hoa.total;

    // Initialize trace if it does not exist
    if (!traces[city]) {
      traces[city] = { x: [], y: [], name: city, mode: 'lines+markers', type: 'scatter' };
    }

    // Push data points for each city
    traces[city].x.push(year);
    traces[city].y.push(total);
  });

  // Convert the traces object to an array of trace objects
  let traceArray = Object.values(traces);

  // Layout configuration for the plot
  let layout = {
    title: "Sum of Houses with HOA by Year Built and City",
    xaxis: {
      title: "Year Built",
      tickformat: 'd'  // Format x-axis as integers (years)
    },
    yaxis: {
      title: "Number of Houses with HOA"
    }
  };

  // Render the plot to the div tag with id "line_graph"
  Plotly.newPlot("line_graph", traceArray, layout);
}

/////////////////


function make_bar1(bar_garage) {

  // extract the x & y values for our bar chart
  let bar_x = bar_garage.map(x => x.homeType);
  let bar_text = bar_garage.map(x => x.homeType);
  let bar_y = bar_garage.map(x => x.percent_with_garage);

  // Trace1 for Garages
  let trace1 = {
    x: bar_x,
    y: bar_y,
    type: 'bar',
    marker: {
      color: "skyblue"
    },
    text: bar_text,
  };


  // Create data array
  let data = [trace1];

  // Apply a title to the layout
  let layout = {
    title: "% of Home Type With A Garage Per Year Built",
    barmode: "group",
    // Include margins in the layout so the x-tick labels display correctly
    margin: {
      l: 50,
      r: 50,
      b: 200,
      t: 50,
      pad: 4
    }
  };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar_chart_garage", data, layout);

}

function make_bar2(bar_heat) {

  // extract the x & y values for our bar chart
  let bar_x = bar_heat.map(x => x.homeType);
  let bar_text = bar_heat.map(x => x.homeType);
  let bar_y = bar_heat.map(x => x.percent_with_heating);

  // Trace1 for Garages
  let trace1 = {
    x: bar_x,
    y: bar_y,
    type: 'bar',
    marker: {
      color: "skyblue"
    },
    text: bar_text,
  };


  // Create data array
  let data = [trace1];

  // Apply a title to the layout
  let layout = {
    title: "% of Home Type With Heat Per Year Built",
    barmode: "group",
    // Include margins in the layout so the x-tick labels display correctly
    margin: {
      l: 50,
      r: 50,
      b: 200,
      t: 50,
      pad: 4
    }
  };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar_chart_heat", data, layout);

}

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

// on page load, don't wait for the click to make the graph, use default
do_work();

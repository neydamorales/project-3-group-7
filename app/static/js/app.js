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
    make_pie(data.pie_data);
    make_table(data.table_data)
  });
}

function make_table(filtered_data) {
  // select table
  let table = d3.select("#data_table");
  let table_body = table.select("tbody");
  table_body.html(""); // destroy any existing rows

  // create table
  for (let i = 0; i < filtered_data.length; i++){
    // get data row
    let data_row = filtered_data[i];

    // creates new row in the table
    let row = table_body.append("tr");
    row.append("td").text(data_row.name);
    row.append("td").text(data_row.full_name);
    row.append("td").text(data_row.region);
    row.append("td").text(data_row.latitude);
    row.append("td").text(data_row.longitude);
    row.append("td").text(data_row.launch_attempts);
    row.append("td").text(data_row.launch_successes);
    row.append("td").text(data_row.launch_attempts - data_row.launch_successes);
  }
}

function make_pie(filtered_data) {
  // sort values
  filtered_data.sort((a, b) => (b.launch_attempts - a.launch_attempts));

  // extract data for pie chart
  let pie_data = filtered_data.map(x => x.launch_attempts);
  let pie_labels = filtered_data.map(x => x.name);

  let trace1 = {
    values: pie_data,
    labels: pie_labels,
    type: 'pie',
    hoverinfo: 'label+percent+name',
    hole: 0.4,
    name: "Attempts"
  }

  // Create data array
  let data = [trace1];

  // Apply a title to the layout
  let layout = {
    title: "SpaceX Launch Attempts",
  }

  Plotly.newPlot("pie_chart", data, layout);
}

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

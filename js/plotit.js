let window_height = $("document").width();
let window_width = $("#sub-container").width();
console.log("width : "+window_width);
console.log("width perc: "+window_width*0.2);

var confirmed_layout = {
    title: 'Confirmed Cases',
    autosize:false,
    height:window_width-(window_height*0.4),
    width:window_width,
    font:{
      family: 'Raleway, sans-serif'
    },
    showlegend: false,
    xaxis: {
      tickangle: -45
    },
    yaxis: {
      zeroline: false,
      gridwidth: 2
    },
    bargap :0.05,
    autosize:true
  };
  // deep coping with spread syntax
  var recovered_layout = {...confirmed_layout};
  recovered_layout.title = "Recovered cases";
  var deaths_layout = {...confirmed_layout}
  deaths_layout.title = "Deaths";

  var config = {
    displayModeBar: false,
    responsive:true
  }

  // let countryname = "Bangladesh";
  async function dataFetcher(countryname){ fetch("https://pomber.github.io/covid19/timeseries.json")
  .then(data=>{
      data.json().then(jsonData=>{
          // console.log(jsonData);
          // unmounting divs at first from html
          Plotly.purge('confirmed_plot');
          Plotly.purge('recovered_plot');
          Plotly.purge('deaths_plot');
          if(jsonData){
            let x_axis_dates = [];
          let confirmed_y_axis = [];
          let recovered_y_axis = [];
          let deaths_y_axis = [];
          let last30Days = jsonData[countryname].slice(-30,);
          // console.log(last30Days);
          last30Days.forEach(element => {
            // only plotting 30 days data
            // console.log(element);
              x_axis_dates.push(element.date);
              confirmed_y_axis.push(element.confirmed);
              recovered_y_axis.push(element.recovered);
              deaths_y_axis.push(element.deaths);
              
          });
          // console.log(confirmed_y_axis);
           let confirmed_data = [
              {
              x: x_axis_dates,
              y: confirmed_y_axis,
              type: 'scatter',
              marker: {color: 'rgb(231, 237, 40)'}
              }
          ];

          let recovered_data = [
            {
              x: x_axis_dates,
              y: recovered_y_axis,
              type: 'scatter',
              marker: {color: 'rgb(38, 230, 34)'}
            }
          ];
          let deaths_data = [
            {
              x: x_axis_dates,
              y: deaths_y_axis,
              type: 'scatter',
              marker: {color: 'rgb(230, 53, 37)'}
            }
          ];

          // remounting plotly with the html divs
          Plotly.newPlot('confirmed_plot', confirmed_data,confirmed_layout,config);
          Plotly.newPlot('recovered_plot',recovered_data,recovered_layout,config);
          Plotly.newPlot('deaths_plot',deaths_data,deaths_layout,config);
          }
      });
  }).catch(error=>{
    console.log("Error occured");
    console.log(error);
  });
  }
  // dataFetcher();
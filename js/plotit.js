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

  var daily_confirmed_layout = {
    title: 'Daily New Cases',
    autosize:false,
    height:window_width-(window_height*0.4),
    width:window_width,
    font:{
      family: 'Raleway, sans-serif'
    },
    showlegend: false,
    xaxis: {
      tickangle: -45,
      tickmode: 'array'
    },
    yaxis: {
      title: 'Daily Cases',
      zeroline: false,
      gridwidth: 2
    },
    bargap :0.5,
    autosize:true
  };
  // deep coping with spread syntax
  var daily_recovered_layout = {...daily_confirmed_layout};
  daily_recovered_layout.title = "Daily New Recovered";
  var daily_deaths_layout = {...daily_confirmed_layout}
  daily_deaths_layout.title = " Daily Deaths";

  // let countryname = "Bangladesh";
  async function historyDataFetcher(countryname){ fetch("https://pomber.github.io/covid19/timeseries.json")
  .then(data=>{
      data.json().then(jsonData=>{
          // console.log(jsonData);
          // unmounting divs at first from html
          Plotly.purge('confirmed_plot');
          Plotly.purge('recovered_plot');
          Plotly.purge('deaths_plot');
          if(jsonData){
          let last30Days = jsonData[countryname].slice(-30,);
          let x_axis_dates = [];
          let confirmed_y_axis = [];
          let recovered_y_axis = [];
          let deaths_y_axis = [];
          let daily_confirmed_y_axis = [];
          let daily_recovered_y_axis = [];
          let daily_deaths_y_axis = [];
          let daily_prev_confirm = last30Days[0].confirmed;
          let daily_prev_recovered = last30Days[0].recovered;
          let daily_prev_deaths = last30Days[0].deaths;
          // console.log(last30Days);
          last30Days.forEach(element => {
            // only plotting 30 days data
            // console.log(element);
              x_axis_dates.push(element.date);
              confirmed_y_axis.push(element.confirmed);
              recovered_y_axis.push(element.recovered);
              deaths_y_axis.push(element.deaths);

              daily_confirmed_y_axis.push(element.confirmed - daily_prev_confirm);
              daily_recovered_y_axis.push(element.recovered - daily_prev_recovered);
              daily_deaths_y_axis.push(element.deaths - daily_prev_deaths)

              daily_prev_confirm = element.confirmed;
              daily_prev_recovered = element.recovered;
              daily_prev_deaths = element.deaths;
              
          });
          // console.log(daily_deaths_y_axis);
          // console.log(daily_recovered_y_axis);
          // console.log(daily_confirmed_y_axis);
          // console.log(confirmed_y_axis);

          // total history data
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

          // daily history data

          let daily_confirmed_data = [
            {
            x: x_axis_dates,
            y: daily_confirmed_y_axis,
            type: 'bar',
            marker: {color: 'rgb(231, 237, 40)'}
            }
        ];

        let daily_recovered_data = [
          {
            x: x_axis_dates,
            y: daily_recovered_y_axis,
            type: 'bar',
            marker: {color: 'rgb(38, 230, 34)'}
          }
        ];
        let daily_deaths_data = [
          {
            x: x_axis_dates,
            y: daily_deaths_y_axis,
            type: 'bar',
            marker: {color: 'rgb(230, 53, 37)'}
          }
        ];

          // remounting plotly with the html divs
          Plotly.newPlot('confirmed_plot', confirmed_data,confirmed_layout,config);
          Plotly.newPlot('recovered_plot',recovered_data,recovered_layout,config);
          Plotly.newPlot('deaths_plot',deaths_data,deaths_layout,config);
          Plotly.newPlot('daily_confirmed_plot', daily_confirmed_data,daily_confirmed_layout,config);
          Plotly.newPlot('daily_recovered_plot',daily_recovered_data,daily_recovered_layout,config);
          Plotly.newPlot('daily_deaths_plot',daily_deaths_data,daily_deaths_layout,config);
          }
      });
  }).catch(error=>{
    console.log("Error occured");
    console.log(error);
  });
  }
  // dataFetcher();
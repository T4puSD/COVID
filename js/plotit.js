let window_height = $("document").width();
let window_width = $("#sub-container").width();
console.log("width : "+window_width);
console.log("width perc: "+window_width*0.2);

var confirmed_layout = {
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
  var recovered_layout = {...confirmed_layout};
  recovered_layout.title = "Daily New Recovered";
  var deaths_layout = {...confirmed_layout}
  deaths_layout.title = " Daily Deaths";

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
          let prev_confirm = last30Days[0].confirmed;
          let prev_recovered = last30Days[0].recovered;
          let prev_deaths = last30Days[0].deaths;
          // confirmed_y_axis.push(prev_confirm);
          last30Days.map(element=>{
            confirmed_y_axis.push(element.confirmed - prev_confirm);
            recovered_y_axis.push(element.recovered - prev_recovered);
            deaths_y_axis.push(element.deaths - prev_deaths);

            prev_confirm = element.confirmed;
            prev_recovered = element.recovered;
            prev_deaths = element.deaths;
          });
          last30Days.forEach(element => {
            // only plotting 30 days data
            // console.log(element);
              x_axis_dates.push(element.date);
              // confirmed_y_axis.push(element.confirmed);
              // recovered_y_axis.push(element.recovered);
              deaths_y_axis.push(element.deaths);
              
          });
          // console.log(confirmed_y_axis);
           let confirmed_data = [
              {
              x: x_axis_dates.slice(1,),
              y: confirmed_y_axis.slice(1,),
              type: 'bar',
              marker: {color: 'rgb(231, 237, 40)'}
              }
          ];

          let recovered_data = [
            {
              x: x_axis_dates.slice(1,),
              y: recovered_y_axis.slice(1,),
              type: 'bar',
              marker: {color: 'rgb(38, 230, 34)'}
            }
          ];
          let deaths_data = [
            {
              x: x_axis_dates,
              y: deaths_y_axis,
              type: 'bar',
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
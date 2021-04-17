let document_width = $("document").width();
let window_width = $("#sub-container").width();
// console.log("width : "+window_width);
// console.log("width perc: "+parseInt((window_width*0.2)/3));

var confirmed_layout = {
    title: 'Confirmed Cases',
    autosize:false,
    height:window_width-(document_width*0.4),
    width:window_width,
    font:{
      family: 'Raleway, sans-serif'
    },
    showlegend: false,
    xaxis: {
      tickangle: -60,
      tickmode: 'auto',
      nticks: parseInt((window_width*0.2)/8)
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
    height:window_width-(document_width*0.4),
    width:window_width,
    font:{
      family: 'Raleway, sans-serif'
    },
    showlegend: false,
    xaxis: {
      tickangle: -60,
      tickmode: 'array',
      nticks: parseInt((window_width*0.2)/8)
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


  // country name iso to full mapping
  let country_name_map = {
    USA : 'US',
    UAE : 'United Arab Emirates',
    UK : 'United Kingdom',
    CAR : 'Central African Republic',
    'S. Korea' : 'Korea, South',
    'St. Vincent Grenadines' : 'Saint Vincent Grenadines'
  }

  // let countryname = "Bangladesh";
  async function historyDataFetcher(countryname){ fetch("https://pomber.github.io/covid19/timeseries.json")
  .then(data=>{
      data.json().then(jsonData=>{
          // console.log(jsonData);
          // unmounting divs at first from html
          Plotly.purge('confirmed_plot');
          Plotly.purge('recovered_plot');
          Plotly.purge('deaths_plot');
          Plotly.purge('daily_confirmed_plot');
          Plotly.purge('daily_recovered_plot');
          Plotly.purge('daily_deaths_plot');
          if(jsonData){
          // finding odd countries with spaces
          // let country_names = []
          // for(var key in jsonData) country_names.push(key);
          // console.log(country_names);
          if(countryname in country_name_map){
            // console.log('in the object list');
            countryname = country_name_map[countryname];
          }


          let last30Days = jsonData[countryname];
          // if country not found in history data
          // then hide the history container
          // else show it
          if(!last30Days){
            $(document).ready(function(){
              $('#sub-container2').hide();
            });
            return;
          } else {
            $(document).ready(function(){
              $('#sub-container2').show();
            });
          }
          // console.log(last30Days.length);
          // Object.assign(confirmed_layout.xaxis,{nticks:(last30Days.length)});

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

            if(element.confirmed<0) confirmed_y_axis.push(0);
            else  confirmed_y_axis.push(element.confirmed);
            
            if(element.recovered<0) recovered_y_axis.push(0);
            else recovered_y_axis.push(element.recovered);
            
            if(element.deaths<0) deaths_y_axis.push(0);
            else deaths_y_axis.push(element.deaths);

              daily_confirmed_y_axis.push(Math.abs(element.confirmed - daily_prev_confirm));
              daily_recovered_y_axis.push(Math.abs(element.recovered - daily_prev_recovered));
              daily_deaths_y_axis.push(Math.abs(element.deaths - daily_prev_deaths));

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
            x: x_axis_dates.slice(1,),
            y: daily_confirmed_y_axis.slice(1,),
            type: 'bar',
            marker: {color: 'rgb(231, 237, 40)'}
            }
        ];

        let daily_recovered_data = [
          {
            x: x_axis_dates.slice(1,),
            y: daily_recovered_y_axis.slice(1,),
            type: 'bar',
            marker: {color: 'rgb(38, 230, 34)'}
          }
        ];
        let daily_deaths_data = [
          {
            x: x_axis_dates.slice(1,),
            y: daily_deaths_y_axis.slice(1,),
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
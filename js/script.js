$(document).ready(function(){
    $(".spinner-container").hide();
    // populating the select element
    setCountries();

    //handling country select
    $( "select" )
  .change(function() {
    var str = "";
    $( "select option:selected" ).each(function() {
      str += $( this ).text() + " ";
    });
    // console.log(str);
    fetchCountryCovidStats(str);
  })
  .trigger( "change" );
});
let jsonAllData = null;
let countryname = "bangladesh";
fetch('https://ipapi.co/json/')
.then(function(response) {
response.json().then(jsonData => {
    // console.log(jsonData);
    countryname = jsonData.country_name;
    if(countryname.split(" ").length > 1){
    countryname = jsonData.country_code_iso3;
    }
    // let country_lang = jsonData.languages.split(',')[0];
    // console.log(countryname.toLowerCase());
    fetchCountryCovidStats(countryname);
});
})
.catch(function(error) {
console.log(error)
});

async function setCountries(){
    fetch('https://coronavirus-19-api.herokuapp.com/countries')
    .then(function(response){
        response.json().then(function(jsonData){
            // console.log(jsonData);
            // storing all the json data for re use
            jsonAllData = jsonData;
            // storing names for sorting
            let country_name_list = [];
            jsonData.forEach(data=>{
                // console.log(data.country);
                country_name_list.push(data.country);
            });
            country_name_list.sort();
            country_name_list.forEach(name=>{
            //    console.log(name);
               // apending every country name to select
               $(document).ready(()=>{
                    $("#select-countries")
                    .append(`<option value="${name}">${name}</option>`)
                })
            })
            // console.log(jsonAllData);

        })
    }).catch(function(error){
        console.log(error);
    })
}

// function fetchEachCountry(jsonAllData)

async function fetchCountryCovidStats(countryname){
    // console.log(countryname);
    fetch(`https://coronavirus-19-api.herokuapp.com/countries/${countryname}`)
    .then(function(response){
        response.json().then(jsonData=>{
            // console.log(jsonData);
            let formatter = new Intl.NumberFormat('en-US');
            let confirmed_cases = formatter.format(jsonData.cases);
            let recovered = formatter.format(jsonData.recovered);
            let deaths = formatter.format(jsonData.deaths);
            // let recover_rate = (jsonData.recovered/jsonData.cases)*100;
            // let death_rate = (jsonData.deaths/jsonData.cases)*100;
            // console.log(recover_rate);
            // console.log(death_rate);
            $(document).ready(()=>{
                $("div#card-head-countryname").html(jsonData.country);
                $("h5#confirmed").text(confirmed_cases);
                $("h5#recovered").text(recovered);
                $("h5#deaths").text(deaths);
                // $("p#recover-percentage").text(recover_rate.toFixed(2)+"%")
                // $("p#death-percentage").text(death_rate.toFixed(2)+"%");
                // $(".loading").hide();
                // $(".localize").show();
            });
        });
    });
}

// Handling The Nav Animation
$(document).ready(function(){
    $("li>a").click(function(event){
        // disabling nav links default action
        event.preventDefault();
        // alert("nice");
        $(this).parent().siblings().find("a").attr("class","nav-link");
        $(this).attr("class","nav-link active");
        let choosed = $(this).attr("id");
        // console.log(choosed);
        // let countryname = $("div#card-head-countryname").text();
        // console.log(countryname);
        // console.log(jsonCurrentCountryData);
        if(choosed == "history-daily"){
            $('#dash_daily_plotly').css('z-index',1);
            $('#dash_plotly').css('z-index',-1);

        } else if(choosed == "history-total"){
            $('#dash_daily_plotly').css('z-index',-1);
            $('#dash_plotly').css('z-index',1);
        }
        if(choosed ==="today"){
            htmlDomOperationsToday(jsonCurrentCountryData);
        }else {
            htmlDomOperations(jsonCurrentCountryData);
        }

    });
});

function resetActiveNavLink(){
    $(document).ready(function(){
        $("ul>li").siblings().find("a").attr("class","nav-link");
        $("ul>li>a#total").attr("class","nav-link active");
    });
}


$(document).ready(function(){
    $("#main-container").hide();
    // $(".spinner-container").hide();
    // populating the select element
    setCountries();

    //handling country select
    $( "select" )
  .change(function() {
    var str = $("select option:selected").val();
    // console.log(str);
    
    // changing active nav link to total
    resetActiveNavLink();    
    //fetchingthestats for the selected country
    fetchCovidStats(str);
  });
});

//init
let jsonCurrentCountryData = null;
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
    fetchCovidStats(countryname);
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
                // ! after Fixing country scrapping commit
                // the country api is assigning "" and "Total:" as country name
                // so to handle it this if condition is added
            if(data.country !="" && data.country != "Total:" && data.country!="World")
            {
                country_name_list.push(data.country);
            }

            });
            country_name_list.sort();
            // console.log(country_name_list);
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

function htmlDomOperations(jsonData){
    //  console.log(jsonData.country);
    let countryname = null;
    if(jsonData.country){
        countryname = jsonData.country;
    } else {
        countryname = 'World Wide'
    }
     let formatter = new Intl.NumberFormat('en-US');
     let confirmed_cases = formatter.format(jsonData.cases);
     let recovered = formatter.format(jsonData.recovered);
     let deaths = formatter.format(jsonData.deaths);
     // let recover_rate = (jsonData.recovered/jsonData.cases)*100;
     // let death_rate = (jsonData.deaths/jsonData.cases)*100;
     // console.log(recover_rate);
     // console.log(death_rate);
     $(document).ready(()=>{
         //resetting the card titles
         $("div#title_confirmed").html("Confirmed");
         $("div#title_deaths").html("Deaths")
         $("div#title_recovered").html("Recovered");
         //resetting recovered_card properties
         $("div#card_recovered").attr("class","card text-white bg-success mb-3");
         //changing dom elements
         $("div#card-head-countryname").html(countryname);
         $("h5#confirmed").text(confirmed_cases);
         $("h5#recovered").text(recovered);
         $("h5#deaths").text(deaths);
         // $("p#recover-percentage").text(recover_rate.toFixed(2)+"%")
         // $("p#death-percentage").text(death_rate.toFixed(2)+"%");
         $(".spinner-container").hide();
         $("#main-container").show();
     });
}

function htmlDomOperationsToday(jsonData){
    let countryname = null;
    if(jsonData.country){
        countryname = jsonData.country;
    } else {
        countryname = 'World Wide'
    }
     let formatter = new Intl.NumberFormat('en-US');
     let today_cases = formatter.format(jsonData.todayCases);
     let active_cases = formatter.format(jsonData.active);
     let today_deaths = formatter.format(jsonData.todayDeaths);
     // let recover_rate = (jsonData.recovered/jsonData.cases)*100;
     // let death_rate = (jsonData.deaths/jsonData.cases)*100;
     // console.log(recover_rate);
     // console.log(death_rate);
     $(document).ready(()=>{
         //changing the titles of the cards
         $("div#title_confirmed").html("New Cases");
         $("div#title_deaths").html("New Deaths")
         $("div#title_recovered").html("Active Cases");
         //changing the recovered card properties
         $("div#card_recovered").attr("class","card text-white bg-info mb-3");
         $("div#card-head-countryname").html(countryname);
         $("h5#confirmed").text(today_cases);
         $("h5#recovered").text(active_cases);
         $("h5#deaths").text(today_deaths);
         // $("p#recover-percentage").text(recover_rate.toFixed(2)+"%")
         // $("p#death-percentage").text(death_rate.toFixed(2)+"%");
         $(".spinner-container").hide();
         $("#main-container").show();
     });
}

async function fetchCovidStats(countryname){
    historyDataFetcher(countryname);
    // no need to handle worldwide as we can fetch it with
    // countries/World api after new patch
    fetch(`https://coronavirus-19-api.herokuapp.com/countries/${countryname}`)
    .then(function(response){
        response.json().then(jsonData=>{
            // after getting jsonData manipulate
            // html elements 
            jsonCurrentCountryData = jsonData;
            htmlDomOperations(jsonData);
        });
    }).catch(error=>{
        console.log(error);
    });
}
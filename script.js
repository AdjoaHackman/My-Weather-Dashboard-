$(document).ready(function () {
    var search = $("#search-button").click(function(){
//need practice with understanding how to obtain and calling api's
   var cityName = $("#search-input").val()
//    alert(cityName)
//    alert("city")
   getCityGeoCodes(cityName)
    })
    //I want to be able to create a function that will call the open weather api so that when the user clicks the search button, the city they entered will show up with the weather data from the API. To get the information for the acceptance criteria, I need to get the long/lat from one api and then use another endpoint (same api) to get the remaining weather data i.e. temp, humidity, etc. 
    //pass parameter, making the call, and parse
    const APIkey = "43d3ce9a4d6be02e5f3dbc9ba49a17b0" 
    var apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q={cityName}&limit=5&appid=' + APIkey;
    var weatherAPI = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=" + APIkey; 
    
    function getCityGeoCodes (cityName) {
       var validURL = apiURL.replace("{cityName}",cityName);
       //replace function is the first parameter of what we are looking for and the second parameter is the new value we are looking for
    //    alert(validURL)
        $.ajax({ 
            url: validURL,
            method: 'GET',
            success: function(response) {
                // Handle the API response here
                console.log(response);
                // alert(response)
                var json = JSON.parse(JSON.stringify(response));
                //we are parsing the response using jquery
                // alert(json[0].name)
                // alert(json[0].lat)
                getWeatherApi(json[0].lat, json[0].lon)
                // alert(json[0].lon)
            },
            error: function(xhr, status, error) {
                // Handle errors here
                console.error(status, error);
            }
            
        });

    function getWeatherApi(lat,lon) {
        var weatherURL = weatherAPI.replace("{lat}",lat);
        var weatherURL = weatherURL.replace("{lon}",lon);
        // alert(weatherURL)
        $.ajax({ 
            url: weatherURL,
            method: 'GET',
            success: function(response) {
                // Handle the API response here
                console.log(response);
                for (let index = 0; index < response.list.length; index+=8) {
                    const forecast = response.list[index];
                    console.log(forecast)
                    let cardelement = document.createElement("div")
                    cardelement.classList.add("card")
                    let listelement = document.createElement("ul")
                    listelement.classList.add("list-group","list-group-flush")
                    let temperature = document.createElement("li")
                    temperature.classList.add("list-group-item")
                    temperature.textContent = forecast.main.temp
                    let humidity = document.createElement("li")
                    humidity.classList.add("list-group-item")
                    humidity.textContent = forecast.main.humidity
                    listelement.append(temperature,humidity)
                    cardelement.append(listelement)
                    document.querySelector(".forecast-cards").append(cardelement)
                }
                //created a for loop for the 5 day forecast. We are increasing by 8 because the array has 40 results and every 8 results is a different day of the week.
                // alert(response)
                var json = JSON.parse(JSON.stringify(response));
                //we are parsing the response using jquery
                // alert(json[0].name)
                // alert(json[0].lat)
                // getWeatherApi(json[0].lat, json[0].lon)
                // alert(json[0].lon)
            },
            error: function(xhr, status, error) {
                // Handle errors here
                console.error(status, error);
            }
        });
        
    }
    }
    function displayForecast(lat,lon) {

        
    }
})
// const APIkey = "43d3ce9a4d6be02e5f3dbc9ba49a17b0" 


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
    var apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q={cityName}&limit=5&units=imperial&appid=' + APIkey ;
    var weatherAPI = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=imperial&appid=" + APIkey; 
    //learned from tutor and the API website that I can update the weather units by addung &units=imperial to the URL, all URL's actions are separated by &. 
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
                getCurrentAPI(json[0].lat, json[0].lon)
                // alert(json[0].lon)
            },
            error: function(xhr, status, error) {
                // Handle errors here
                // console.error(status, error);
            }
            
        });
        function getCurrentAPI (lat,lon) {
            var currentAPI = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid=" + APIkey; 
            var currentURL = currentAPI.replace("{lat}",lat);
            var currentURL = currentURL.replace("{lon}",lon);
            $.ajax({ 
                url: currentURL,
                method: 'GET',
                success: function(response) {
                    console.log(response)
                    var singleDay = document.querySelector(".single-day")
                    let cardelement = document.createElement("div")
                    cardelement.classList.add("card")
                    singleDay.append(cardelement)
                    var dailyTemp = document.createElement("div")
                    dailyTemp.innerHTML = "Temp: " + Math.floor(response.main.temp) + "&deg;F"
                    cardelement.append(dailyTemp)
                    let dailyWind = document.createElement("ul")
                    cardelement.append(dailyWind)
                    dailyWind.textContent = "Wind: " + Math.floor(response.wind.speed) + " MPH"
                    let dailyHumidity = document.createElement("ul")
                    cardelement.append(dailyHumidity)
                    dailyHumidity.textContent = "Humidity: " + response.main.humidity + "%"
                    let dailyWeatherIcon = document.createElement("img")
                    dailyWeatherIcon.setAttribute("src",`https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
                    cardelement.prepend(dailyWeatherIcon)
                    let dailyForecastDate = document.createElement("datetime")
                    cardelement.prepend(dailyForecastDate)
                    dailyForecastDate.textContent = response.dt
                     
                },
                error: function(xhr, status, error) {
                    // Handle errors here
                    console.error(status, error);
                }
            });
        }
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
                    cardelement.classList.add("card","bg-forecast-cards")
                    let listelement = document.createElement("ul")
                    listelement.classList.add("list-group","list-group-flush", "bg-forecast-cards")
                    let temperature = document.createElement("li")
                    temperature.classList.add("list-group-item", "bg-forecast-cards")
                    temperature.innerHTML = "Temp: " + Math.floor(forecast.main.temp) + "&deg;F"
                    let wind = document.createElement("li")
                    wind.classList.add("list-group-item","bg-forecast-cards")
                    wind.textContent = "Wind: " + Math.floor(forecast.wind.speed) + " MPH"
                    let humidity = document.createElement("li")
                    humidity.classList.add("list-group-item","bg-forecast-cards" )
                    humidity.textContent = "Humidity: " + forecast.main.humidity + "%"
                    listelement.append(temperature,humidity,wind)
                    cardelement.append(listelement)
                    document.querySelector(".forecast-cards").append(cardelement) 
                    let weatherIcon = document.createElement("img")
                    weatherIcon.setAttribute("src",`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`)
                    cardelement.prepend(weatherIcon)
                    let forecastDate = document.createElement("h3")
                    cardelement.prepend(forecastDate)
                    forecastDate.textContent = forecast.dt_txt.split(" ")[0] 
                    let weatherDescription = document.createElement("div")
                    weatherDescription.textContent = forecast.weather[0].description
                    // weatherDescription.setAttribute("div",`https://openweathermap.org/img/wn/${forecast.weather[0].description}@2x.png`)
                    cardelement.append(weatherDescription)
                }
                //created elements in the JS instead of the HTML for the card with the 5 day forecast. Including the element for the temp, humidity, as well as adding the link for the image for the icon (given by the API website). Also learned how to add the date that was included in the array and splitting it so that the time did not show up on the cards. 
                //learned what prepend is - so I can put the icon and the date at the top of the forecast instead of moving the code around. 
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


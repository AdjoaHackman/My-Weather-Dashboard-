$(document).ready(function () {
    showSearchHistory()
    $(".city-buttons").on("click", ".btn",function (event) {
        // getCityGeoCodes
        //add .btn to the list of classes because the city button class applied to the whole div instead of the buttons and was giving an error
        //adding a click handler on the container (city buttons) that gets fired when the buttons get clicked. The .on event listener was used in place of .click. 
        // console.log(e)
        getCityGeoCodes(event.target.innerText)
    })
    var search = $("#search-button").click(function () {
        //need practice with understanding how to obtain and calling api's
        var cityName = $("#search-input").val()
        //    alert(cityName)
        //    alert("city")
        getCityGeoCodes(cityName)
    })
    //I want to be able to create a function that will call the open weather api so that when the user clicks the search button, the city they entered will show up with the weather data from the API. To get the information for the acceptance criteria, I need to get the long/lat from one api and then use another endpoint (same api) to get the remaining weather data i.e. temp, humidity, etc. 
    //pass parameter, making the call, and parse
    const APIkey = "43d3ce9a4d6be02e5f3dbc9ba49a17b0"
    var apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q={cityName}&limit=5&units=imperial&appid=' + APIkey;
    var weatherAPI = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=imperial&appid=" + APIkey;
    //learned from tutor and the API website that I can update the weather units by adding &units=imperial to the URL, all URL's actions are separated by &. 
    function getCityGeoCodes(cityName) {
        var validURL = apiURL.replace("{cityName}", cityName);
        //replace function is the first parameter of what we are looking for and the second parameter is the new value we are looking for
        //    alert(validURL)
        $.ajax({
            url: validURL,
            method: 'GET',
            success: function (response) {
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
            error: function (xhr, status, error) {
                // Handle errors here
                // console.error(status, error);
            }

        });
        function getCurrentAPI(lat, lon) {
            var currentAPI = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid=" + APIkey;
            var currentURL = currentAPI.replace("{lat}", lat);
            var currentURL = currentURL.replace("{lon}", lon);
            $.ajax({
                url: currentURL,
                method: 'GET',
                success: function (response) {
                    console.log(response)
                    var singleDay = document.querySelector(".single-day")
                    let cardelement = document.createElement("div")
                    cardelement.classList.add("card", "w-100", "bg-success","border-0", "text-white", "p-2")
                    singleDay.innerHTML = ""
                    singleDay.append(cardelement)
                    var dailyTemp = document.createElement("div")
                    dailyTemp.innerHTML = "Temp: " + Math.floor(response.main.temp) + "&deg;F"
                    cardelement.append(dailyTemp)
                    let dailyWind = document.createElement("div")
                    cardelement.append(dailyWind)
                    dailyWind.textContent = "Wind: " + Math.floor(response.wind.speed) + " MPH"
                    let dailyHumidity = document.createElement("div")
                    cardelement.append(dailyHumidity)
                    dailyHumidity.textContent = "Humidity: " + response.main.humidity + "%"
                    let dailyWeatherIcon = document.createElement("img")
                    dailyWeatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
                    dailyWeatherIcon.classList.add("daily-icon")
                    cardelement.prepend(dailyWeatherIcon)
                    let dailyForecastDate = document.createElement("h6")
                    cardelement.prepend(dailyForecastDate)
                    var currentDate = new Date(response.dt * 1000)
                    var currentMonth = currentDate.getMonth() + 1
                    var currentDay = currentDate.getDate()
                    var currentYear = currentDate.getFullYear()
                    dailyForecastDate.textContent = `${cityName} ${currentMonth}/${currentDay}/${currentYear}`
                    //creating a string to display on the page. We are using the templates (back ticks) to create the string. Taught by my tutor
                },
                error: function (xhr, status, error) {
                    // Handle errors here
                    console.error(status, error);
                }
            });
        }
        function getWeatherApi(lat, lon) {
            var weatherURL = weatherAPI.replace("{lat}", lat);
            var weatherURL = weatherURL.replace("{lon}", lon);
            // alert(weatherURL)
            $.ajax({
                url: weatherURL,
                method: 'GET',
                success: function (response) {
                    // Handle the API response here
                    console.log(response);
                    document.querySelector(".forecast-cards").innerHTML = ""
                    for (let index = 0; index < response.list.length; index += 8) {
                        const forecast = response.list[index];
                        console.log(forecast)
                        let cardelement = document.createElement("div")
                        cardelement.classList.add("card","w-100", "bg-forecast-cards")
                        let listelement = document.createElement("ul")
                        listelement.classList.add("list-group", "list-group-flush", "bg-forecast-cards")
                        let temperature = document.createElement("li")
                        temperature.classList.add("list-group-item", "bg-forecast-cards")
                        temperature.innerHTML = "Temp: " + Math.floor(forecast.main.temp) + "&deg;F"
                        let wind = document.createElement("li")
                        wind.classList.add("list-group-item", "bg-forecast-cards")
                        wind.textContent = "Wind: " + Math.floor(forecast.wind.speed) + " MPH"
                        let humidity = document.createElement("li")
                        humidity.classList.add("list-group-item", "bg-forecast-cards")
                        humidity.textContent = "Humidity: " + forecast.main.humidity + "%"
                        listelement.append(temperature, humidity, wind)
                        cardelement.append(listelement)
                        document.querySelector(".forecast-cards").append(cardelement)
                        let weatherIcon = document.createElement("img")
                        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`)
                        weatherIcon.classList.add("forecast-icons")
                        cardelement.prepend(weatherIcon)
                        let forecastDate = document.createElement("h5")
                        cardelement.prepend(forecastDate)
                        // forecastDate.textContent = forecast.dt_txt.split(" ")[0]
                        var currentDate = new Date(forecast.dt * 1000)
                        var currentMonth = currentDate.getMonth() + 1
                        var currentDay = currentDate.getDate()
                        var currentYear = currentDate.getFullYear()
                        forecastDate.textContent = `${currentMonth}/${currentDay}/${currentYear}`
                        //     let weatherDescription = document.createElement("div")
                        //     weatherDescription.textContent = forecast.weather[0].description
                        //     // weatherDescription.setAttribute("div",`https://openweathermap.org/img/wn/${forecast.weather[0].description}@2x.png`)
                        //     cardelement.append(weatherDescription)
                        // }
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
                    }
                },
                error: function (xhr, status, error) {
                    // Handle errors here
                    console.error(status, error);
                }
            });

        }
    }
    $("#search-button").click(function () {

        //select the input in here 
        // get the string that you searched for;  
        var cityNameKey = document.getElementById("search-input").value;
        var cityArray = localStorage.getItem("city")
        if (cityArray) {
            //this is where we will add to the existing array so it will show up in the saved searches. If not, we will just display the city
            cityArray = JSON.parse(cityArray)
            cityArray.push(cityNameKey)
            localStorage.setItem("city", JSON.stringify(cityArray));
            //parse turns a string into a readable object. Push allows us to add elements to an array - in this case, adding more cities to the array as the user continues to search. We are adding JSON.stringify to the value of the local storage because it converts an object to a string. 
        } else {
            cityArray = localStorage.setItem("city", JSON.stringify([cityNameKey]))
        }
        showSearchHistory()
    })      //every time we are creating a local storage key, the key has to be a string with quotes
    function showSearchHistory() {
        //retrieve information from local storage and then render a button for each city
        var cityArray = localStorage.getItem("city")
        if (!cityArray) {
            return
        } 
        cityArray = JSON.parse(cityArray)
        document.querySelector(".city-buttons").innerHTML = ""
        for (let index = 0; index < cityArray.length; index++) {
            const cityName = cityArray[index];
            let listelement = document.createElement("button")
            listelement.classList.add("btn","btn-primary","mt-3")
            listelement.innerHTML = cityName
            document.querySelector(".city-buttons").append(listelement)
            
        }
    // const APIkey = "43d3ce9a4d6be02e5f3dbc9ba49a17b0"
}
})
$(document).ready(function () {
    var search = $("#search-button").click(function(){
//need practice with understanding how to obtain and calling api's
   var cityName = $("#search-input").val()
   getCityGeoCodes(cityName)
    })
    function getCityGeoCodes (cityName) {
        $.ajax({ 
            url: 'http://api.openweathermap.org/geo/1.0/direct?q={cityName}&limit=5&appid=43d3ce9a4d6be02e5f3dbc9ba49a17b0',
            method: 'GET',
            success: function(response) {
                // Handle the API response here
                console.log(response);
            },
            error: function(xhr, status, error) {
                // Handle errors here
                console.error(status, error);
            }
        });
    }
   
})
const APIkey = "43d3ce9a4d6be02e5f3dbc9ba49a17b0" 


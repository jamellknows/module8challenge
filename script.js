const API_KEY = "cc67b19dc916f461ab3e7d8d3c68bb27"


let previousSearches = JSON.parse(localStorage.getItem('previousSearches'))
$('#results-list').hide()
if(previousSearches == null)
{
    console.log("new storage")
    previousSearches = []
}

let city_name;
var clear;
    
   let search =  function(city_name){
    event.preventDefault()
    clear()
    $('#forecast').empty()
    $('#temp').empty()
    $('#humidity').empty()
    $('#wind').empty()
    let Moment = moment()
    Moment.format('Do MMMM')
    let date = String(Moment._d).slice(0,15)
    let previousElem = []
    if(city_name == null){
        city_name = $('#search-input').val().trim()
    }
    let cityQuery =`http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=5&appid=${API_KEY}`
    cityQuery = String(cityQuery)
    
    $.ajax({
        url: cityQuery,
        method: "GET"
    }).then(function(response){
        let lat = response[0].lat.toFixed(2)
        let lon = response[0].lon.toFixed(2) 
        let geoQuery = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        geoQuery = String(geoQuery)
       $.ajax({
        url: geoQuery,
        method: "GET",
        success: function(data){
            // Forecast
            // console.log(data)
            let Moment = moment()
            Moment.format('Do MMMM')
            let date = String(Moment._d).slice(0,15)
            for(let i = 1; i < data.list.length; i++){

               let forecastTemp = String((data.list[i].main.temp -273.15).toFixed(2))
               let forecastHumidity = String(data.list[i].main.humidity)
               let forecastWind = String(data.list[i].wind.speed)
               let forecastTime = date
               let icon = data.list[i].weather[0].icon
               console.log(icon) 
                // console.log(forecastTemp + " " + forecastHumidity + " " + forecastWind)
                let forecastTemplate = `<div class="forecastEl">
                                        <p class="result">` + forecastTime + ` </p>
                                        <img style="width:'2px;height: '2px';" alt ="weather" src="http://openweathermap.org/img/wn/${icon}@2x.png">
                                        <p class="result">`+ forecastTemp + ` ℃ </p>
                                         <p class="result">` + forecastHumidity + `%</p>
                                        <p class="result"> `+ forecastWind + ` m/s </p>
                                        </div>`
                let forecastId = $("#forecast"+String(i)) 
                
                forecastId.append(forecastTemplate)
                i = i+8
                let day = moment.duration(1,'d')
                Moment.add(day).days()
                Moment.format('Do MMMM')
                date = String(Moment._d).slice(0,15)
                

                
                
            }
            let forecastCityName = String(data.city.name)
            let previousForecast = [forecastCityName, data]
            previousElem.push(previousForecast)
            

            
        }
       }).then(function(response){
        let city = response.city
        let data = response.list
        $('#city').text(`${date} : ${city.name}, ${city.country}`)

        
    
        
        let currentQuery = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        $.ajax({
            url: currentQuery,
            method: "GET",
            success: function(data){
                // console.log(data)
                let currentTemp = (data.main.temp-273.15).toFixed(2)
                let currentHumidity = data.main.humidity 
                let currentWind = data.wind.speed
                let icon = data.weather[0].icon
                // console.log(icon)
                $('#city').append(`<img alt ="weather" src="http://openweathermap.org/img/wn/${icon}@2x.png">`)
                $('#temp').text(`Temp: ${currentTemp} ℃ `)
                $('#humidity').text(`Humidity: ${currentHumidity}%`)
                $('#wind').text(`Wind Speed: ${currentWind} m/s`)
                $('#results-list').show()

                let cityName = String(data.name)
                let previousCurrent = [cityName, data]
                previousElem.push(previousCurrent)
                previousElem = [previousElem]
                previousSearches = previousSearches.concat(previousElem)
                localStorage.setItem("previousSearches", JSON.stringify(previousSearches))



            


            }
        }).then(function(){
            console.log("ran")
            
        })

       })
    })

}


$('#search-button').click(search)

$('.previousbutton').click(function(){
    clear()
    let index = $(this).attr('data-index')
    let searchCity = previousSearches[index][1][0]
    search(searchCity)
    // for the length of the data 
    
   
    
   // $('#city').text(`${date} : ${city.name}, ${city.country}`)

    
})


$('.previousbutton').each(function(){
    let index = $(this).attr('data-index')
    let searchCity = previousSearches[index][1][0]
    $(this).text(searchCity)
})
clear = function(){
    $('#city').empty()
    $('#city').text("")
    $('#temp').text("")
    $('#wind').text("")
    $('.forecasts-div').children().empty()
  
}
  



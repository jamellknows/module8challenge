const API_KEY = "cc67b19dc916f461ab3e7d8d3c68bb27"


let previousSearches = JSON.parse(localStorage.getItem('previousSearches'))

if(previousSearches == null)
{
    console.log("new storage")
    previousSearches = []
}
console.log(previousSearches)


$('#search-button').click(function(){
    event.preventDefault()
    $('#forecast').empty()
    $('#temp').empty()
    $('#humidity').empty()
    $('#wind').empty()
    let Moment = moment()
    Moment.format('Do MMMM')
    let date = String(Moment._d).slice(0,15)
    let previousElem = []
    let city_name = $('#search-input').val().trim()
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
            for(let i = 1; i < data.list.length; i++){

               let forecastTemp = String((data.list[i].main.temp -273.15).toFixed(2))
               let forecastHumidity = String(data.list[i].main.humidity)
               let forecastWind = String(data.list[i].wind.speed)
               let forecastTime = String(new Date(data.list[i].dt)).slice(0,12)
                // console.log(forecastTemp + " " + forecastHumidity + " " + forecastWind)
                let forecastTemplate = `<div class="forecastEl">
                                        <p class="result">` + forecastTime + `</p>
                                        <p class="result">`+ forecastTemp + `</p>
                                         <p class="result">` + forecastHumidity + `</p>
                                        <p class="result"> `+ forecastWind + ` </p>
                                        </div>`
                let forecastId = $("#forecast"+String(i)) 
                
                forecastId.append(forecastTemplate)
                i = i+8
                
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
                let cityName = String(data.name)
                let previousCurrent = [cityName, data]
                previousElem.push(previousCurrent)
                console.log(typeof previousCurrent)
                console.log(previousElem)
                console.log(typeof previousSearches)
                previousSearches = previousSearches.concat(previousElem)
                // $.merge(previousSearches, previousElem)
                localStorage.setItem("previousSearches", JSON.stringify(previousSearches))
                console.log(previousSearches)



            


            }
        }).then(function(){
            console.log("ran")
        })
        //Save data to previous







        // $(data).each(function(index){
        //     console.log(data[index])
        // })
       })
    })
})

function previousResults(){

}
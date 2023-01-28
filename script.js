const API_KEY = "cc67b19dc916f461ab3e7d8d3c68bb27"



$('#search-button').click(function(){
    event.preventDefault()
    $('#forecast').empty()
    $('#temp').empty()
    $('#humidity').empty()
    $('#wind').empty()
    let Moment = moment()
    Moment.format('Do MMMM')
    let date = String(Moment._d).slice(0,15)
    console.log(date)

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
            for(let i = 0; i < data.list.length; i++){
               let temp = data.list[i].main.temp 
               let humidity = data.list[i].main.humidity
               let wind = data.list[i].wind.speed
                i = i+8
                let forecastTemplate = `<div class="forecastEl">
                                        <p class="result">${(temp-273.15).toFixed(2)}℃</p>
                                        <p class="result">${humidity}%</p>
                                        <p class="result">${wind} m/s</p>
                                        </div>`
                $('#forecast').append(forecastTemplate)
                
            }
        }
       }).then(function(response){
        let city = response.city
        let data = response.list
        console.log(data)
        $('#city').text(`${date} : ${city.name}, ${city.country} `)
        $('#temp').text(`${(data[0].main.temp -273.15).toFixed(2)} ℃ `)
        $('#humidity').text(`${data[0].main.humidity}%`)
        $('#wind').text(`${data[0].wind.speed} m/s`)
        let currentQuery = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        $.ajax({
            url: currentQuery,
            method: "GET",
            success: function(data){
                let currentTemp = (data.main.temp-273.15).toFixed(2)
                let currentHumidity = data.main.humidity 
                let currentWind = data.wind.speed
            


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
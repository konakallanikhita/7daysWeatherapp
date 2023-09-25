function getWeather() {
    var city = document.getElementById("cityInput").value;
    var apiKey = "2e867b73f23beea6515b38e935ecc19f"; 

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            var currentWeather = document.getElementById("currentWeather");
            currentWeather.innerHTML = `
            <div class="weath">
                <h2>Current Weather in ${city}</h2>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <p>Weather Condition: ${data.weather[0].main}</p>
                <p>Date and Time: ${new Date().toLocaleString()}</p>
                </div>
            `;
        });

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            var forecast = document.getElementById("forecast");
            forecast.innerHTML = "";

            var days = {};
            var forecastItems = [];

            data.list.forEach(item => {
                var date = item.dt_txt.split(" ")[0];

                if (!days[date]) {
                    days[date] = [];
                }

                days[date].push(item);
            });

            Object.keys(days).forEach(date => {
                var dayData = days[date];
                var minTemp = Number.MAX_SAFE_INTEGER;
                var maxTemp = Number.MIN_SAFE_INTEGER;
                var humiditySum = 0;
                var weatherConditions = {};

                dayData.forEach(item => {
                    minTemp = Math.min(minTemp, item.main.temp_min);
                    maxTemp = Math.max(maxTemp, item.main.temp_max);
                    humiditySum += item.main.humidity;

                    if (!weatherConditions[item.weather[0].main]) {
                        weatherConditions[item.weather[0].main] = 1;
                    } else {
                        weatherConditions[item.weather[0].main]++;
                    }
                });

                var avgHumidity = Math.round(humiditySum / dayData.length);
                var mostCommonCondition = Object.keys(weatherConditions).reduce((a, b) =>
                    weatherConditions[a] > weatherConditions[b] ? a : b
                );

                var forecastItem = `
                
                    <div class="forecast-item">
                        <h3>${new Date(date).toLocaleDateString("en-US", { weekday: "long" })}</h3>
                        <p>Temperature Range: ${minTemp}°C - ${maxTemp}°C</p>
                        <p>Average Humidity: ${avgHumidity}%</p>
                        <p>Most Common Condition: ${mostCommonCondition}</p>
                    </div>
                    
                `;

                forecastItems.push(forecastItem);
            });

            forecast.innerHTML = forecastItems.join("");
        });
}
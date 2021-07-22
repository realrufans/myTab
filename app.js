const coin_pricesEl = document.getElementById("coin_Prices");
const add_btn = document.getElementById("add_btn");
const remove_btn = document.getElementById("remove_btn");
const input = document.getElementById("user_Crypto_Input");
const image_Credit = document.getElementById("image_Credit");
const centerWidget = document.getElementById("centerWidget");
const weatherDiv = document.getElementById("weatherDiv");

// Display coins from the localStroage
function renderCoinList() {
    var items = JSON.parse(localStorage.getItem("details"))

    let html = "";

    for (let coins of items) {
        html += `
            <p>${coins.name}: <span class="coin_prices">$${coins.price}</span></p>

            `;
    }
    coin_pricesEl.innerHTML = html;
}

renderCoinList();

// fetch a coin enterd by the user

function cryptoPrice(user_Input) {
    fetch(`https://api.coingecko.com/api/v3/coins/${user_Input}`)
        .then((response) => {
            if (!response.ok) {
                throw Error("Something went wrong");
            }
            return response.json();
        })
        .then((data) => {
            data = data.market_data.current_price.usd;
            let crypto_Details = [];

            let details = {
                name: user_Input,
                price: data,
            };
            crypto_Details = JSON.parse(localStorage.getItem("details") || "[]");
            crypto_Details.unshift(details);
            localStorage.setItem("details", JSON.stringify(crypto_Details));
            renderCoinList();
        })
        .catch((error) => {
            alert("PLease check your internet connection!");
        })

}

// add the coin entered by the user
add_btn.addEventListener("click", fectchit);

function fectchit() {
    cryptoPrice(input.value.toLowerCase());
}


// remove the coin removed by the user
remove_btn.addEventListener("click", remove_coin);

function remove_coin() {


    var items = JSON.parse(localStorage.getItem("details"));

    for (var i = 0; i < items.length; i++) {
        if (items[i].name === input.value.toLowerCase()) {
            items.splice(i, 1);
        }
    }

    items = JSON.stringify(items); //Restoring object left into items again

    localStorage.setItem("details", items);
    renderCoinList();
}

// fetch random image
function random_Background_Img() {
    fetch(
            "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature"
        )
        .then((response) => {
            if (!response.ok) {
                throw Error("Something went wrong")
            }
            return response.json()
        })
        .then((data) => {
            document.body.style.backgroundImage = ` url(${data.urls.regular})`;
            image_Credit.innerHTML = ` <p>Image By: ${data.user.name}</p>`;
        })
        .catch(error => {
            document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080
                )`
            image_Credit.textContent = `By: Dodi Achmad`
        })
}
random_Background_Img();

// get curret time and date
function current_time() {
    const time_and_date = new Date();
    const weekdays = new Array(7);
    weekdays[0] = "sunday";
    weekdays[1] = "monday";
    weekdays[2] = "tuesday";
    weekdays[3] = "wednesday";
    weekdays[4] = "thursday";
    weekdays[5] = "friday";
    weekdays[6] = "sartuday";

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const day = weekdays[time_and_date.getDay()];
    const month = monthNames[time_and_date.getMonth()];

    centerWidget.innerHTML = `
    <div class="date_Details">
    <p id='time'>${time_and_date.getHours()}:${time_and_date.getMinutes()}:${time_and_date.getSeconds()}</p>
    <p>${day}, ${time_and_date.getMonth()} ${month}</p>
</div>
    `;
}

// keep the time updated
setInterval(current_time, 1000);


// fectch user location
navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    fetch(
            `https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial`
        )
        .then((response) => {
            if (!response.ok) {
                throw Error('something went wrong')
            }
            return response.json();
        })
        .then((data) => {

            console.log(data)
            const icon = data.weather[0].icon;
            const temp = data.main.temp;
            const Celcius_value = Math.floor(((temp - 32) * 5) / 9);

            weatherDiv.innerHTML = `
            <div id="wIcon_with_DEegree" class="wIcon_with_DEegree">
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" />
            <p id="weather_value">
                ${Celcius_value}
                
                

               <span id="=celcius">°C</span>
            </p>
        </div>
        <p id="location_name">${data.name}, ${data.sys.country}</p>
            `;
        })
        .catch(err => {
            alert('PLease check your internet connection')
        })
});
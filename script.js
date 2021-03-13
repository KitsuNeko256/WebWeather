
function deleteCity(element, cityID) {
	window.localStorage.removeItem(cityID);
	element.parentElement.parentElement.remove();
}

function addCity(searchType, newCity, searchValue = document.getElementById('favInputName').value) {
    let xhr = new XMLHttpRequest();
	if (searchType == "name") {
		searchValue = searchValue.toLowerCase();
		xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=395cea13dd1f22db118d27c7297923c3&units=metric`);
    } else if (searchType == "coord") {
		
	} else if (searchType == "id") {
		xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?id=${searchValue}&appid=395cea13dd1f22db118d27c7297923c3&units=metric`);
	}
	   
	xhr.send();
    
    xhr.onload = function() {
      if (xhr.status != 200) {
        alert(`Город не найден!`);
      } else {
        var cityData = JSON.parse(xhr.response);
		var cityName = cityData.name;
        if (newCity && window.localStorage.getItem(cityData.id) !== null) {
			alert(`Город ${cityName} уже есть в списке!`);
			return;
		}
		var template = document.getElementById("favCityTemplate");
		var	clone = template.content.cloneNode(true);
		var city = clone.children[0];
		var header = city.children[0];
		header.children[0].innerHTML = cityName;
		header.children[1].src = `https://openweathermap.org/img/w/${cityData.weather[0].icon}.png`;
		header.children[2].innerHTML =  `${cityData.main.temp}°C`;
		header.children[3].setAttribute('onclick',`deleteCity(this, ${cityData.id})`);

		var list = city.children[1].children;
		list[0].innerHTML = `<b>Ветер</b> ${cityData.wind.speed} м/с`;
		list[1].innerHTML = `<b>Облачность</b> ${cityData.weather[0].description}`;
		cityData.main.pressure *= 0.75;
		list[2].innerHTML = `<b>Давление</b> ${cityData.main.pressure} мм р.с.`;
		list[3].innerHTML = `<b>Влажность</b> ${cityData.main.humidity} %`;
		list[4].innerHTML = `<b>Координаты</b> [${cityData.coord.lon}, ${cityData.coord.lat}]`;


		document.getElementById("favList").appendChild(city);

		if (window.localStorage.getItem(cityData.id) === null) {
			window.localStorage.setItem(cityData.id, cityData.id);
		}
      }
    };

	if(newCity)
		document.getElementById('favInputName').value = '';
}

function initFavCityInput() {
	const input = document.getElementById("favInputName");

	input.addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			document.getElementById("favInputButton").click();
		}
	});
}

function initOffline() {
	window.addEventListener("offline", function (e) {
		alert("Соединение потеряно, перезагрузите страниицу!");
	});
}

function loadFavCities() {
	for (var i = 0; i < window.localStorage.length; i++) {
		console.log(window.localStorage.key(i));
		addCity("id", false, window.localStorage.key(i));
	}
}


function init() {
	initOffline();
	initFavCityInput();
	loadFavCities();
}




function getLocation() {
    if (navigator.geolocation) {
		var t = navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
		alert("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    var elem = document.getElementById("demo");
    elem.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
}

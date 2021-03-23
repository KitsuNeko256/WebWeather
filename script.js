const DIRNAME = "http://localhost:3000"


function hideCity(city) {
	city.children[0].style.visibility = "hidden";
	city.children[1].style.visibility = "hidden";
	city.classList.add("cityLoadPlaceholder");
}
function showCity(city) {
	city.children[0].style.visibility = "visible";
	city.children[1].style.visibility = "visible";
	city.classList.remove("cityLoadPlaceholder");
}

function init() {	
	getLocation();
	initOffline();
	initFavCityInput();
	loadFavCities();
}

function getLocation() {
    if (navigator.geolocation) {
		hideCity(document.getElementById("mainCity"));
		navigator.geolocation.getCurrentPosition(geoCity, defaultCity);
    } else { 
		alert("Geolocation is not supported by this browser.");
		defaultCity();
    }
}
function defaultCity() {
	let cityName = "Санкт-Петербург";
	let xhr = new XMLHttpRequest();
	xhr.open('GET', DIRNAME + `/weather/city?name=${cityName}`);
	updateMainCity(xhr);
}
function geoCity(geoData) {
	let lat = geoData.coords.latitude;
	let lon = geoData.coords.longitude;
	let xhr = new XMLHttpRequest();
	xhr.open('GET', DIRNAME + `/weather/coordinates?lat=${lat}&lon=${lon}`);
	updateMainCity(xhr);
}
function updateMainCity(xhr) {
	xhr.send();
	xhr.addEventListener("error", function() {
		alert("Ошибка сервера. Перезагрузите страницу или попробуйте позже.");
	});
	xhr.addEventListener("load", function() {
		let cityData = JSON.parse(xhr.response);
		let city = document.getElementById("mainCity");
		let header = city.children[0];
		header.children[0].innerHTML = cityData.name;
		header.children[1].src = `https://openweathermap.org/img/wn/${cityData.weather[0].icon}@4x.png`;
		header.children[2].innerHTML =  `${Math.round(cityData.main.temp)}°C`;

		updateWeatherList(city.children[1].children, cityData);
		showCity(city);
	});
}

function updateWeatherList(list, cityData) {
	list[0].innerHTML = `<b>Ветер</b> ${cityData.wind.speed} м/с`;
	list[1].innerHTML = `<b>Облачность</b> ${cityData.weather[0].description}`;
	cityData.main.pressure *= 0.75; //turn from hpa to mm
	list[2].innerHTML = `<b>Давление</b> ${Math.round(cityData.main.pressure)} мм р.с.`;
	list[3].innerHTML = `<b>Влажность</b> ${cityData.main.humidity} %`;
	list[4].innerHTML = `<b>Координаты</b> [${cityData.coord.lon}, ${cityData.coord.lat}]`;
}

function initOffline() {
	window.addEventListener("offline", function (e) {
		alert("Соединение потеряно, перезагрузите страниицу!");
	});
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
function loadFavCities() {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', DIRNAME + `/favorites`);
	xhr.send();
	xhr.addEventListener("error", function() {
		alert("Ошибка сервера. Перезагрузите страницу или попробуйте позже.");
	});
	xhr.addEventListener("load", function() {
		data = JSON.parse(xhr.response);
		for (let i = 0; i < data.length; i++) {
			addCity("id", data[i]._id);
		}
	});
}


function addCity(searchType, searchValue = document.getElementById('favInputName').value) {
	if (searchValue === '') {
		return;
	}
	let template = document.getElementById("favCityTemplate");
	let	clone = template.content.cloneNode(true);
	let city = clone.children[0];
	hideCity(city);
	document.getElementById("favList").appendChild(city);
	
    let xhr = new XMLHttpRequest();
	if (searchType == "name") {
		searchValue = searchValue.toLowerCase();
		let xhrPost = new XMLHttpRequest();
		xhrPost.open('POST', DIRNAME + `/favorites?name=${searchValue}`);
		xhrPost.send();
		document.getElementById('favInputName').value = '';
		xhrPost.addEventListener("load", function() {
			if (xhrPost.status === 404) {
				alert("Город не найден!");
				city.remove();
				return;
			} else if (xhrPost.status === 409) {
				alert("Город уже есть в списке!");
				city.remove();
				return;
			} else if (xhrPost.status === 200) {
				xhr.open('GET', DIRNAME + `/weather/city?name=${searchValue}`);
				updateFavCity(xhr, city);
			}
		});
    } else if (searchType == "id") {
		xhr.open('GET', DIRNAME + `/weather/id?id=${searchValue}`);
		updateFavCity(xhr, city);
	}
}

function updateFavCity(xhr, city) {
	xhr.send();

	xhr.addEventListener("error", function() {
		alert("Ошибка сервера. Перезагрузите страницу или попробуйте позже.");
	});
	xhr.addEventListener("load",  function() {
        let cityData = JSON.parse(xhr.response);
		let header = city.children[0];
		header.children[0].innerHTML = cityData.name;
		header.children[1].src = `https://openweathermap.org/img/wn/${cityData.weather[0].icon}@4x.png`;
		header.children[2].innerHTML = `${Math.round(cityData.main.temp)}°C`;
		header.children[3].addEventListener('click', function(){deleteCity(header.children[3], cityData.id)}, false);
		
		updateWeatherList(city.children[1].children, cityData);

		showCity(city);
    });
}

function deleteCity(element, cityID) {
	let xhr = new XMLHttpRequest();
	xhr.open("DELETE", DIRNAME + `/favorites?id=${cityID}`);
	xhr.send();
	xhr.addEventListener("error", function() {
		alert("Ошибка сервера. Перезагрузите страницу или попробуйте позже.");
	});
	xhr.addEventListener("load", function() {
		if (xhr.status == 200) {
			element.parentElement.parentElement.remove();
		} else {
			alert("Server error");
		}
	});
}

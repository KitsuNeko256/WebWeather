const express = require('express')
const https = require('https')
const cors = require('cors')
const MongoClient = require("mongodb").MongoClient;
const server = express()
const port = 3000
let database = null;

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
mongoClient.connect(function(error, client){
    if(error) {
        return console.log(error);
    }
    database = client.db('main');
});

server.use(cors());

function findCity (url, response) {
	https.get(url, (httpResponse) => {
		if (httpResponse.statusCode === 404) {
			response.status(404).send("City not found");
		} else {
			let data = '';
			httpResponse.on('data', (newData) => {
				data = newData;
			});
			httpResponse.on('end', () => {
				data = JSON.parse(data);
				response.status(200).send(data);
			});
		}
	}).on("error", (error) => {
		response.status(404).send("City not found");
	});
}


server.get('/weather/city', (request, response) => {
	if (Object.keys(request.query).includes('name')) {
		findCity(`https://api.openweathermap.org/data/2.5/weather?q=${request.query.name}&appid=395cea13dd1f22db118d27c7297923c3&units=metric`, response);
	} else {
		response.status(400).send("Incorrect request by city name");
	};
});

server.get('/weather/coordinates', (request, response) => {
	if (Object.keys(request.query).includes('lat') && Object.keys(request.query).includes('lon')) {
		findCity(`https://api.openweathermap.org/data/2.5/weather?lon=${request.query.lon}&lat=${request.query.lat}&appid=395cea13dd1f22db118d27c7297923c3&units=metric`, response);
	} else {
		response.status(400).send("Incorrect request by coordinates");
	}
});	

server.get('/weather/id', (request, response) => {
	if (Object.keys(request.query).includes('id')) {
		findCity(`https://api.openweathermap.org/data/2.5/weather?id=${request.query.id}&appid=395cea13dd1f22db118d27c7297923c3&units=metric`, response);
	} else {
		response.status(400).send("Incorrect request by id");
	}
});	

server.get('/favorites', (request, response) => {
	database.collection('cities').find().toArray(function(error, result) {
        response.status(200).send(result);
    });
});

server.delete('/favorites', (request, response) => {
	database.collection('cities').deleteOne({_id: Number(request.query.id)}, function(error, result) {
	if (error) {
		response.status(404).send("Server error");
	} else {
		response.status(200).send("OK");	
	}
	});
});

server.post('/favorites', (request, response) => {
	https.get(`https://api.openweathermap.org/data/2.5/weather?q=${request.query.name}&appid=395cea13dd1f22db118d27c7297923c3&units=metric`, (httpResponse) => {
		if (httpResponse.statusCode == 404) {
			response.status(404).send("City not found");
		} else {
			let data = '';
			httpResponse.on('data', (newData) => {
				data = newData;
			});
			httpResponse.on('end', () => {
				data = JSON.parse(data);
				database.collection('cities').find({_id: data.id}).toArray((error, result) => {
					if (result.length === 0) {
						database.collection('cities').insertOne({_id: data.id});
						response.status(200).send("OK");
					}
					else {
						response.status(409).send("City already added");
					}
				});
			})
		}
	})
});

server.listen(port, () => console.log(`WebWeather listening port ${port}`));

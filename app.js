//TODO - Enter your deviceId (MAC address)
var deviceId = '1067ab45d5d4';


//MQTT library
var mqtt = require('mqtt');

//first create an HTTP server which will simply redirect to the IoT Quickstart Portal
var http = require('http');

var http_host = (process.env.VCAP_APP_HOST || 'localhost');
var http_port = (process.env.VCAP_APP_PORT || 3000);

http.createServer(function (req, res) {
	res.statusCode = 302;
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Location', 'http://5.153.3.6/?deviceId=' + deviceId);
	res.end('Redirecting');
}).listen(http_port,http_host);





var clientId = 'quickstart:' + Date.now();

console.log(clientId);

var iot_props = {};

//parse VCAP_SERVICES if running in Bluemix
if (process.env.VCAP_SERVICES)
{
	var env = JSON.parse(process.env.VCAP_SERVICES);

	for (var svcName in env) 
	{
		console.log(svcName);
	}
	console.log(env);
	//find the IoT Service
	if (env['InternetOfThings'])
	{
		iot_props = env['InternetOfThings'][0]['credentials'];
		console.log(iot_props.endpoint_host);
		console.log(iot_props.endpoint_port);
	}
	else
	{
		console.log('You must bind the InternetofThings service to this application');
	}
}


var mqtt_host = (iot_props.endpoint_host || '46.16.188.201');
var mqtt_port = (iot_props.endpoint_port || 1883);
var topic_template = iot_props.topic_template || 'iot-1/d/${device_id}/evt/+/json';

console.log(mqtt_host + ':' + mqtt_port);

//create the MQTT client
client = mqtt.createClient(mqtt_port,mqtt_host, { "clientId": clientId } );
client.subscribe(topic_template.replace('${device_id}',deviceId));

client.on('message', 
	function (topic, message) 
	{
	  console.log(message);
	}
);


//helper function to generate the correct topic string
function generateTopic(deviceId,messageType)
{


}

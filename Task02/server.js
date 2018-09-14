// server.js
const net = require('net');
const port = 8124;
var startID=0;
const server = net.createServer((client) => {
  console.log('Client connected');

  client.ID=Date.now() + startID;
  client.isStartTalking=false;
  startID++;
  client.setEncoding('utf8');

  client.on('data', (data) => {
  	if(!client.isStartTalking)
  	{
  		if(data==='QA')
  		{
  			startTalking(client);
  			client.isStartTalking=true;
  		}
  		else
  		{
  			sayError('DEC',client);
  		}
    }
    else
    {
    	saySomething('its okay',client);
    }
    console.log(data);
    //client.write('\r\nHello!\r\nRegards,\r\nServer\r\n'+client.ID+'\n\r');
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});


function startTalking(client) {
	
	client.write('ACK');

}
function sayError(errorString,client) {
	
	client.write(errorString);

}
function saySomething(string,client) {

	client.write(string);
	
}
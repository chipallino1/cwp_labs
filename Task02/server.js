// server.js
const net = require('net');
const port = 8124;

const fs=require('fs');
var qaArr;

fs.readFile('qa.json',(err,data)=>{
	qaArr=JSON.parse(data);
	for (let i = 0; i < qaArr.length; i++) {
		qaArr[i].wrongAnswer=Math.random() * (qaArr.length - 0) + 0;
	}
});

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
    	//saySomething('its okay',client);
    	//console.log(data);
    	data=data.substring(5);
    	console.log(client.ID+' '+data);
    	getAnswer(data,client);
    }
    //console.log(data);
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
function getAnswer(string,client) {
	
	for(let i=0;i<qaArr.length;i++)
	{
		if(qaArr[i].question===string)
		{
			let rand=Math.random() * (qaArr.length - 0) + 0;
			let temp=Math.random() * (qaArr.length - 0) + 0;
			if(rand>temp)
			{
				fs.appendFile('client_'+client.ID+'.txt','\n question: '+qaArr[i].question+' - data: '+qaArr[i].wrongAnswer+' \n',()=>{});
				client.write('data:'+qaArr[i].wrongAnswer);
				return;
			}
			fs.appendFile('client_'+client.ID+'.txt','\n question: '+qaArr[i].question+' - data: '+qaArr[i].answer+' \n',()=>{});
			client.write('data:'+qaArr[i].answer);
		}
	}

}
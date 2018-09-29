// client.js
const net = require('net');
const port = 8124;
let i=0;
const client = new net.Socket();

client.setEncoding('utf8');

client.connect(port, function() {
  console.log('Connected');
  client.write('REMOTE');
});

client.on('data', function(data) {
  console.log(data);
  if(data==='ACK')
  {
  	client.write('COPY|'+process.argv[2]+'|'+process.argv[3]);
  }
  if(data==='DEC')
  {

  	client.destroy();
  }
  if(data==='submit')
  	{
  		if(i==0)
  		{
  			client.write('ENCODE|'+process.argv[4]+'|'+process.argv[5]+'/'+process.argv[6]);
  			i++;
  		}
  		else
  		{
  			client.write('DECODE|'+process.argv[5]+'|'+'D:/text.txt'+'/'+process.argv[6]);
  		}
  	}
  
});

client.on('close', function() {
  console.log('Connection closed');
});
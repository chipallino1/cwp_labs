// server.js
const net = require('net');
const crypto=require('crypto');
const port = 8124;

//console.log('1111');
const fs = require('fs');

const server = net.createServer((client) => {
  console.log('Client connected');

  client.setEncoding('utf8');

  client.on('data', (data) => {
    console.log(data);
    
    if(data==='REMOTE')
    {
    	client.write('ACK');
    }
    else
    {
    	if(data.indexOf('COPY')>-1)
    	{
    		findSrcDest(data,client,copyFile);
    	}
    	if(data.indexOf('ENCODE')>-1)
    	{
    		findSrcDestKey(data,client,encode);
    	}
    	if(data.indexOf('DECODE')>-1)
    	{
    		findSrcDestKey(data,client,decode);
    	}
    	//else
    	//{
    	//	client.write('DEC');
    	//}
    	
    }

  });

  client.on('end', () =>{ console.log('Client disconnected');});
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});

function findSrcDest(data,client,callback) {
	

	let src=data.substring(data.indexOf('|')+1,data.lastIndexOf('|'));
	let dest=data.substring(data.lastIndexOf('|')+1);
	//console.log('src '+src);
	//console.log('dest '+dest);
	callback(src,dest,client,sendSubmit);

}
function findSrcDestKey(data,client,callback) {
	
	let src=data.substring(data.indexOf('|')+1,data.lastIndexOf('|'));
	let dest=data.substring(data.lastIndexOf('|')+1,data.lastIndexOf('/'));
	let key=data.substring(data.lastIndexOf('/')+1);

	callback(src,dest,key,client,sendSubmit);

}
function copyFile(src,dest,client,callback) {
	
	const stream=fs.createReadStream(src);

	stream.on('readable',()=>{

		let data=stream.read();
		if(data!=null)
		{
			let file=fs.createWriteStream(dest);
			file.end(data);
			callback(client);
		}

		
	})

}
var en;
function encode(src,dest,key,client,callback) {

	const cipher = crypto.createCipher('aes192', 'a password');

	let encrypted = '';
	cipher.on('readable', () => {
  	const data = cipher.read();
  	if (data)
  	  encrypted += data.toString('hex');
	});
	cipher.on('end', () => {
			console.log(encrypted);
			let file=fs.createWriteStream(dest);
			file.end(encrypted);
  
	});

	const stream=fs.createReadStream(src);

	stream.on('readable',()=>{

		let data=stream.read();
		if(data!=null)
		{
			cipher.write(data);
			cipher.end();
			callback(client);
		}

		
	})



	

}
function decode(src,dest,key,client,callback) {
	
	
	console.log(src);
		console.log(dest);
	const decipher = crypto.createDecipher('aes192', 'a password');

	let decrypted = '';
	decipher.on('readable', () => {
  	const data = decipher.read();
  	if (data)
    	decrypted += data.toString('utf8');
   // console.log(decrypted);
	});
	decipher.on('end', () => {
  	console.log(decrypted);
  // Prints: some clear text data
	});


	const stream=fs.createReadStream(src);

	stream.on('readable',()=>{

		let data=stream.read();

		//console.log(data);
		if(data!=null)
		{
			data=data.toString('utf8');
			console.log(data);
			decipher.write(data,'hex');
			decipher.end();
		}

		
	})




}
function sendSubmit(client) {
	
	client.write('submit');

}
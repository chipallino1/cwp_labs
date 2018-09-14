// client.js
const net = require('net');
const port = 8124;

const fs=require('fs');
var qaArr;

var curQues=0;

fs.readFile('qa.json',(err,data)=>{
	qaArr=JSON.parse(data);
	console.log('------------------------------------------');
	for(let i=0;i<qaArr.length;i++)
	{
		let random1=Math.random() * (qaArr.length - 0) + 0;
		let random2=Math.random() * (qaArr.length - 0) + 0;
		let temp;
		temp=qaArr[random1];
		qaArr[random1]=qaArr[random2];
		qaArr[random2]=temp;
	}


const client = new net.Socket();

client.setEncoding('utf8');

client.connect(port, function() {
  console.log('Connected');
  client.write('QA');
});

client.on('data', function(data) {
  console.log(data);
   if(data==='ACK')
   {
   		//console.log(qaArr);
   		client.write('ques:'+qaArr[curQues].question);
   }

   if(data==='DEC')
   {
   		client.destroy();
   }

   if(data.indexOf('data:')+1)
   {
   		data=data.substring(5);
   		checkAnswer(data,curQues)
   		if(curQues+1!=qaArr.length)
   		{
   			curQues++;
   			client.write('ques:'+qaArr[curQues].question);
   		}
   		else
   		{
   			client.destroy();
   		}

   }
 
});

client.on('close', function() {
  console.log('Connection closed');
});
});
function checkAnswer(data,current)
{
	if(qaArr[current].answer===data)
	{
		console.log('\n'+qaArr[current].question);
		console.log(qaArr[current].answer + ' server gave right answer!\n');
	}
	else
	{
		console.log('\n'+qaArr[current].question);
		console.log(qaArr[current].answer + ' server gave wrong answer!\n');
	}
}
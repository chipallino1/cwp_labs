// client.js
const net = require('net');
const port = 8124;

const fs=require('fs');
var qaArr;

var curQues=0;



const client = new net.Socket();

client.setEncoding('utf8');

client.connect(port, function() {
  console.log('Connected');
  client.write('FILES');
});

client.on('data', function(data) {
  console.log(data);
   if(data==='ACK')
   {
   		//console.log(qaArr);

      sendFiles(process.argv);
   	//	client.write('ques:'+qaArr[curQues].question);
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
function sendFiles(argv)
{

  for(let i=2;i<argv.length;i++)
  {
   // console.log(fs);
    getFiles(argv[i],sendFile);

  }

}
function getFiles(file,callback) {
 // fs=require('fs');
  //console.log(fs1);
fs.stat(file,(err,stats)=>
{
  //console.log(''+file.replace(new RegExp (dir, 'g'), ''));
  if(stats.isDirectory())
  {
    console.log("dir");
    fs.readdir(file,(err,files)=>{
    for (var i = 0; i <files.length; i++) {
    var dirPath=file+'/'+files[i];
    getFiles(dirPath);
      }
    });
  }
  else
  {
    console.log("file");
    sendFile(file);
  }
})
}

function sendFile(file) {
  
  fs.readFile(file,(err,data)=>{

        client.write(file+'|'+data);

  });

}
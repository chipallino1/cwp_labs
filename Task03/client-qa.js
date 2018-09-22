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
   if(data==='got file')
   {

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

  //for(let i=2;i<argv.length;i++)
  //{
   // console.log(fs);
    getFiles(argv[2],checkDirOrFile);

  //}

}
var allDirs=[];
function getFiles(file,callback) {
 // fs=require('fs');
  //console.log(fs1);
  
  fs.readdir(file,(err,files)=>{
    for (let i = 0; i <files.length; i++) {
    let dirPath=file+'/'+files[i];
    allDirs.push(dirPath);
   // getFiles(dirPath,callback);
      }
      callback(allDirs,chooseWhatToDo);
    });
  
/*fs.stat(file,(err,stats)=>
{
  //console.log(''+file.replace(new RegExp (dir, 'g'), ''));
  if(stats.isDirectory())
  {
    console.log("dir");
    fs.readdir(file,(err,files)=>{
    for (var i = 0; i <files.length; i++) {
    let dirPath=file+'/'+files[i];
    getFiles(dirPath,callback);
      }
    });
  }
  else
  {
    console.log("file");
    callback(file);
  }
})*/
}

function checkDirOrFile(file,callback) {
  
    console.log(file.length);
    let arr=[];
    if(Array.isArray(file))
    {
      arr=file;
    }
    else
    {
      arr.push(file);
    }
    fs.stat(arr[0],(err,stats)=>
{
  //console.log(''+file.replace(new RegExp (dir, 'g'), ''));
  if(stats.isDirectory())
  {
    console.log("dir");
    callback("dir",arr[0]);
  }
  else
  {
    console.log("file");
    callback("file",arr[0]);
  }
})

}

function chooseWhatToDo(fileOrDir,fileName) {
  
    console.log(allDirs.length);
    allDirs.splice(0,1);
    if(fileOrDir==='dir')
    {

        getFiles(fileOrDir);
    }
    else
    {
      sendFile(fileName);
    }

}

function sendFile(file) {
  
  fs.readFile(file,(err,data)=>{

        client.write(file+'|'+data);

  });

}
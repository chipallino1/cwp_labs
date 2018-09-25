// client.js
const net = require('net');
const port = 8124;

const fs=require('fs');
var qaArr;

var curQues=0;

let dirsQueue=[];
dirsQueue=process.argv;

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

      sendFiles(dirsQueue);
   	//	client.write('ques:'+qaArr[curQues].question);
   } 

   if(data==='DEC')
   {
   		client.destroy();
   }
   if(data==='submit')
   {
      if(allDirs.length>0)
        checkDirOrFile(allDirs[0],chooseWhatToDo);
      else
      {
        if(currDir<dirsQueue.length-1)
        {
          currDir++;
          sendFiles(dirsQueue);
        }
        else
          {
            client.destroy();
          }
      }
      //console.log('submit');
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

var currDir=2;
function sendFiles(argv)
{

  //for(let i=2;i<argv.length;i++)
  //{
   // console.log(fs);
  // allDirs.push(argv[currDir]);
    getFiles(argv[currDir],checkDirOrFile);

  //}

}
var allDirs=[];
function getFiles(file,callback) {
 // fs=require('fs');
  //console.log(fs1);

  console.log('--------'+file);
  //console.log('allDirs '+allDirs[0]);
  fs.readdir(file,(err,files)=>{
    //allDirs.splice(0,1);
    for (let i = 0; i <files.length; i++) {
    let dirPath=file+'/'+files[i];
    //console.log('---'+files[i]);
    allDirs.push(dirPath);
   // getFiles(dirPath,callback);
      }
      //console.log(callback);
      
      if(callback!=undefined)
      callback(allDirs,chooseWhatToDo);
    });
  

}

function checkDirOrFile(file,callback) {
  
    //console.log(file.length);
    let arr=[];
    if(Array.isArray(file))
    {
      arr=file;
    }
    else
    {
      arr.push(file);
    }
    //console.log('ewrwerwer'+allDirs[0]);
    fs.stat(allDirs[0],(err,stats)=>
{
  //console.log(''+file.replace(new RegExp (dir, 'g'), ''));
 // console.log(arr[0]);
  if(stats.isDirectory())
  {
   // console.log(arr[0]);
    callback("dir",arr[0]);
  }
  else
  {
    //console.log("file");
    callback("file",arr[0]);
  }
})

}

function chooseWhatToDo(fileOrDir,fileName) {
  
    //console.log(allDirs.length);
    
    
    if(fileOrDir==='dir')
    {
        console.log('1');
        //getFiles(allDirs[0],checkDirOrFile);
      // dirsQueue.push(allDirs[0]);
       allDirs.splice(0,1);
       if(allDirs.length>0)
          checkDirOrFile(allDirs[0],chooseWhatToDo);
       /*
       if(allDirs.length>0)
          checkDirOrFile(allDirs[0],chooseWhatToDo);
         else
        {
          if((currDir+1)<dirsQueue.length)
          {
            currDir=currDir+1;
            allDirs.push(dirsQueue[currDir]);
            checkDirOrFile(allDirs[0],chooseWhatToDo);
          }
      }*/

    }
    else
    {
      sendFile(fileName);
      allDirs.splice(0,1);
    }
    
    

}

function sendFile(file) {
  
  fs.readFile(file,(err,data)=>{

        client.write(file+'|'+data);
        //allDirs.splice(0,1);

  });

}
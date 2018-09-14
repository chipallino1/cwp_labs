var dir=process.argv[2];
const fs=require('fs');
if(process.argv.length<3)
{
	console.log('You have only 2 arguments. Please add path.');
	return;
}
if(process.argv[3]!=null)
{
	console.log('Path to directory contains space. Write path in " ".');
	return;
}

dir=dir.replace(/\\/g, "/");

var str=`const fs=require('fs');
var allstring=[];
dir='`+dir+`';
getFiles(dir);
var dirName=currentDirName(dir);
fs.mkdir(dir+'/'+dirName,()=>{
	console.log('---New '+dirName+' created---');
});
currentDirName(dir);
var arr=copyTxtFiles(dir,fs);






function getFiles(file) {
fs.stat(file,(err,stats)=>
{
	console.log(''+file.replace(new RegExp (dir, 'g'), ''));
	if(stats.isDirectory())
	{
		fs.readdir(file,(err,files)=>{
		for (var i = 0; i <files.length; i++) {
		var dirPath=file+'/'+files[i];
		getFiles(dirPath);
			}
		});
	}
})
}

function currentDirName(dir)
{
	var lastIndex=dir.lastIndexOf('/');	
	var dirName=dir.substring(lastIndex+1);
	return dirName;
}

function checkTxtExtension(file)
{
	var lastIndex=file.lastIndexOf('.');
	var extension=file.substring(lastIndex+1);
	if(extension=='txt')
	{
		
		return true;
	}
	else
	{
		return false;
	}
}
function copyTxtFiles(dir,fs)
{
	var dirName=currentDirName(dir);
	var destArr=[];
	fs.readdir(dir,(err,files)=>{

			for(var i=0;i<files.length;i++)
			{
				if(checkTxtExtension(files[i]))
				{
				let src=dir+'/'+files[i];
				let dest=dir+'/'+dirName+'/'+files[i];
				destArr.push(dest);
				fs.copyFile(src,dest,(err)=>{
					addCopyright(dest,fs);
					console.log('coping end  ');
					
					});
				
		
				
				}
			}
			

	});
	
	return destArr;


}



function addCopyright(dest,fs)
{
	var buffer;
	
	fs.readFile(dest, function(error,data){
            								
        allstring.push(data);
        data='©'+data+'©';

        buffer=Buffer.from(data);
        fs.open(dest, 'r+', function(err, fd) {

   						
  		fs.write(fd,buffer,0,buffer.length,0, function(err, written,string) {
    				   				 
  			fs.close(fd, function() {
  				follow(dest,fs);
  				var out=JSON.stringify(allstring);
  				fs.writeFile("config.json", out, function(err) { });
				
       								 });
   						 });
					});
              											  
	});
				
				
}

function follow(file,fs)
{
	fs.watch(file,(eventType,filename)=>{
		if (eventType=='rename') 
		{
			console.log(filename + ' renamed..............');
		}
		if(eventType=='change')
		{
			console.log(filename + ' changed..............');
		}
	})
	
}`;


fs.writeFile(dir+'/summary.js',str,()=>{console.log('its ok!');});

const cp=require('child_process');
cp.fork(dir+'/summary.js');
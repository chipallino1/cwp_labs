const fs=require('fs');
dir='D:/Универ/Учеб/3 курс/пкп/Tasks/Task01';
getFiles(dir);
var dirName=currentDirName(dir);
fs.mkdir(dir+'/'+dirName,()=>{
	console.log('its ok');
});
currentDirName(dir);
copyTxtFiles(dir,fs);




function getFiles(file) {
fs.stat(file,(err,stats)=>
{
console.log(file.replace(new RegExp (dir, 'g'), ''));
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
		console.log('txt file');
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
	//console.log(dirName);
	fs.readdir(dir,(err,files)=>{

			for(var i=0;i<files.length;i++)
			{
				if(checkTxtExtension(files[i]))
				{
				var src=dir+'/'+files[i];
				var dest=dir+'/'+dirName+'/'+files[i];
				fs.copyFile(src,dest,()=>{

					console.log('coping end');
					fs.open(dest, 'r+', function(err, fd) {

   						 if (err)
   						  {
     						   throw 'error opening file: ' + err;
  							}
  							
  						  fs.write(fd,buffer , 0, 1,0 , function(err) {
    				   				 if (err) throw 'error writing file: ' + err;
  						      					fs.close(fd, function() {
         				  								 console.log('file written');
       								 });
   						 });
						});
					});
				}
			}
	});
}
var buffer=Buffer.from('©');
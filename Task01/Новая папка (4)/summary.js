const fs=require('fs');
dir='D:/Универ/Учеб/3 курс/пкп/Tasks/Task01';
getFiles(dir);
var dirName=currentDirName(dir);
fs.mkdir(dir+'/'+dirName,()=>{
	console.log('its ok');
});
currentDirName(dir);




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
		return true;
	}
	else
	{
		return false;
	}
}
function 
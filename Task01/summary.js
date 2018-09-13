const fs=require('fs');
var allstring=[];
dir='D:/Универ/Учеб/3 курс/пкп/Tasks/Task01';
getFiles(dir);
var dirName=currentDirName(dir);
fs.mkdir(dir+'/'+dirName,()=>{
	console.log('its ok');
});
currentDirName(dir);
var arr=copyTxtFiles(dir,fs);
//console.log(arr.length);
/*for(var i=0;i<arr.length;i++)
{
	
	addCopyright(arr[i],fs);
}*/


var countfiles;

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
	var destArr=[];
	//console.log(dirName);
	fs.readdir(dir,(err,files)=>{

			for(var i=0;i<files.length;i++)
			{
				if(checkTxtExtension(files[i]))
				{
				var src=dir+'/'+files[i];
				var dest=dir+'/'+dirName+'/'+files[i];
				destArr.push(dest);
				fs.copyFile(src,dest,(err)=>{

					console.log('coping end  ');
					
					});
				
		
				
				}
			}
			addCopyright(destArr[0],fs);
			addCopyright(destArr[1],fs);
			addCopyright(destArr[2],fs);
			addCopyright(destArr[3],fs);
			//toJSON(destArr,fs);

	});
	
	return destArr;


}



function addCopyright(dest,fs)
{
	var buffer;
	
	fs.readFile(dest, function(error,data){
            								console.log("Асинхронное чтение файла");
             								  if(error) throw error; // если возникла ошибка
             								  			allstring.push(data);
             										   data='©'+data+'©';

             										    buffer=Buffer.from(data);
             										  fs.open(dest, 'r+', function(err, fd) {

   						 if (err)
   						  {
     						   throw 'error opening file: ' + err;
  							}
  							//buffer=Buffer.from('hh');

  						  fs.write(fd,buffer,0,buffer.length,0, function(err, written,string) {
    				   				 if (err) throw 'error writing file: ' + err;
  						      					fs.close(fd, function() {
  						      							follow(dest,fs);
  						      							var out=JSON.stringify(allstring);
  						      							fs.writeFile("config.json", out, function(err) {

    															if(err) throw err;

  																		  console.log("The file was created!");

																	});

         				  								 console.log('f------------'+out);
       								 });
   						 });
						});
              											  //console.log('1111111111111111'+data);  // выводим считанные данные
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
	
}
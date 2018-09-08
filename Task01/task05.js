const dir=process.argv[2];
const fs=require('fs');

if(process.argv[3]!=null)
{
	console.log('Path to directory contains space. Write path in " ".');
	return;
}

/*fs.readdir(dir,(err,files)=>{
	for (var i = 0; i <files.length; i++) {
		
		var dirPath=dir+'/'+files[i];
		//console.log(dirPath);
		getFiles(dirPath);
	}
}); */
getFiles(dir);

//getFiles(dir);
fs.appendFile(dir+'/summary.js',"console.log('Hello!');",()=>{console.log('its ok!');}); 


function getFiles(file) {
	
	//console.log(file);
	fs.stat(file,(err,stats)=>
				{
					
					console.log(file);
					if(stats.isDirectory())
					{
						//console.log(file);
						//console.log(stats.isDirectory());
						

						fs.readdir(file,(err,files)=>{
						for (var i = 0; i <files.length; i++) {
		
						var dirPath=file+'/'+files[i];
						//console.log(dirPath);
						getFiles(dirPath);
					}
					}); 
						//getFiles(file);

					}
				
			})

/*
fs.readdir(dirPath,(err,files)=>{
	for(var i=0;i<files.length;i++)
		{
			pathToFile=dirPath+'/'+files[i];
			console.log(pathToFile);
			fs.stat(pathToFile,(err,stats)=>
				{
					
					console.log(pathToFile);
					if(stats.isDirectory())
					{
						console.log(stats.isDirectory());
						
						getFiles(pathToFile);

					}
				
			})
			

		}



});*/
}
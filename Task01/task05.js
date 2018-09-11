var dir=process.argv[2];
const fs=require('fs');

if(process.argv[3]!=null)
{
	console.log('Path to directory contains space. Write path in " ".');
	return;
}

dir=dir.replace(/\\/g, "/");

var str="const fs=require('fs');\n"+
"dir='"+dir+"';\n"+
"getFiles(dir);\n"+
"function getFiles(file) {\n"+
	
	
	"fs.stat(file,(err,stats)=>\n"+
				"{\n"+
					
					"console.log(file.replace(new RegExp (dir, 'g'), ''));\n"+
					"if(stats.isDirectory())\n"+
					"{\n"+
						

						"fs.readdir(file,(err,files)=>{\n"+
						"for (var i = 0; i <files.length; i++) {\n"+
		
						"var dirPath=file+'/'+files[i];\n"+
						"getFiles(dirPath);\n"+
					"}\n"+
					"});\n"+ 
						

					"}\n"+
				
			"})\n"+


"}\n";
//fs.writeFile(dir+'/summary.js',str,()=>{console.log('its ok!');});
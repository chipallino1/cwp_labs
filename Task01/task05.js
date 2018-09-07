const dir=process.argv[2];
if(dir[0]!='"' && dir[dir.length-1]!='"')
{
	console.log('Please write path with " " ("D:/folder")');
	return;
}
const fs=require('fs');
fs.appendFile(dir+'/summary.js',"console.log('Hello!');",()=>{console.log('its ok!');}); 
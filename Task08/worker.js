const fs=require('fs');

let path;
let X;
let stop;

if(process.argv.length>3)
{
	path=process.argv[2];
	X=process.argv[3];
}
else
{
	stop=false;
}
startAddRandom(path);

function startAddRandom(path,callback)
{
	console.log('start!');
	
	fs.readFile(path,(error,data)=>
		{
			console.log('read!');
			let allRandom=[];
			allRandom=JSON.parse(data);
			console.log('parse good!');
			setTimeout(addRandom,X,path,allRandom);
		});
}
function addRandom(path,allRandom)
{
	allRandom.push(3);
	fs.writeFile(path,JSON.stringify(allRandom),(error)=>
		{
			console.log('write in file!');
			if(!stop)
			{
				setTimeout(addRandom,X,path,allRandom);
			}
			else
			{
				return;
			}
		});
}
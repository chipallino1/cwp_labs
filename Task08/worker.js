const fs=require('fs');

const path=process.argv[2];
const X=process.argv[3];
let stop;

let all=[];
addRandom(path,all);

function startAddRandom(path,callback)
{
	console.log('start!');
	
	fs.readFile(path,(error,data)=>
		{
			console.log('read!');
			let allRandom=[];
			allRandom=JSON.parse(data);
			console.log('parse good!');
			setTimeout(addRandom,X*1000,path,allRandom);
		});
}
function addRandom(path,allRandom)
{
	console.log(path);
	const add=getRandomInt(0,10000);
	allRandom.push(add);
	fs.writeFile(path,JSON.stringify(allRandom),(error)=>
		{
			console.log('write in file!');
			if(!stop)
			{
				setTimeout(addRandom,X*1000,path,allRandom);
			}
			else
			{
				return;
			}
		});
}
function getRandomInt(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

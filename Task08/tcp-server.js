const net = require('net');
const cp=require('child_process');
const fs=require('fs');
const port = 8124;

let workers=[];
let processes=[];


const server = net.createServer((client) => {
  console.log('Client connected');

  client.setEncoding('utf8');

  client.on('data', (data) => {
    console.log(data);
    let get=JSON.parse(data);
   // console.log(get['X']);
    if(get['X']!=undefined)
    {
    	startWorker(get['X'],client,sendResponse);
    }
    if(get['getAll']!=undefined)
    {
    	getWorkers(client);
    }
    if(get['remove']!=undefined)
    {
    	removeWorker(get.id,client);
    }
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});



function startWorker(X,client,callback) {

	let Args=[];
	let id=Date.now();
	let path=id+".json";
	console.log(id);
	let worker={id:path,startedOn:true};
	workers.push(worker);

	Args.push(path);
	Args.push(X);
	let currCp=cp.fork('worker.js',Args);
	currCp.myId=id;
	processes.push(currCp);
	console.log(currCp.pid);
	callback(client,worker);



}
function sendResponse(client,worker) {
	

	client.write(JSON.stringify(worker));

}

function getWorkers(client){

		for(let i=0;i<workers.length;i++)
		{
			fs.readFile(workers[i].id,(error,data)=>{
				workers[i].body=JSON.parse(data);
			})
		}
		sendResponse(client,workers);

}
function removeWorker(id,client)
{
	for(let i=0;i<workers.length;i++)
	{
		if(workers[i].id.replace(".json","")==id)
		{
			console.log(1);
			workers[i].startedOn=false;
			processes[i].kill();
		}
	}
	sendResponse(client,workers);
}
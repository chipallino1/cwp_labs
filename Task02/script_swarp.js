const cp=require('child_process');

var i=0;
var app=cp.fork('client.js');
exec(app);

function exec(app) {
	app.on('exit',()=>{

		if(i==process.argv[2])
			return;
		app=cp.fork('client.js');
		exec(app);
		i++;
	});
}

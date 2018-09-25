const cp=require('child_process');
let stringArg=process.argv.splice(3);
console.log(stringArg);


console.log(process.env);
let countOfClients=process.argv[2];
for(let i=0;i<countOfClients;i++)
	cp.fork('client-qa.js',stringArg);




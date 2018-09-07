var res='';

for (var i=2; i < process.argv.length; i++) {
	res+=process.argv[i]+' '; 
}

console.log(res);
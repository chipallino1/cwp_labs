const prom = require('bluebird');
const axios = require('axios');

const urlPop2017='http://api.population.io:80/1.0/population/2017/Belarus/';
const urlPop2014='http://api.population.io:80/1.0/population/2014/Belarus/';
const urlPop2015='http://api.population.io:80/1.0/population/2015/Belarus/';
const urlMany=[ 'http://api.population.io:80/1.0/population/2017/Canada/',
				'http://api.population.io:80/1.0/population/2017/Germany/',
				'http://api.population.io:80/1.0/population/2017/France/'];

axios.get(urlPop2017).
	then(populationAll);

const popMany=[];
for(let i=0;i<urlMany.length;i++)
{
	popMany.push(axios.get(urlMany[i]));
}
prom.all(popMany).then(populationMany);

const popBel14_15=[
		urlPop2014,
		urlPop2015
];

prom.any([axios.get(urlPop2014),axios.get(urlPop2015)]).then(population14_15);



function populationAll(response) {
	
	let total=0;
	let data=[];
	data=JSON.stringify(response.data);
	let parseData=JSON.parse(data);
	for(let i=0;i<parseData.length;i++)
	{
		total+=parseData[i].total;
	}
	console.log("Population in Belarus in 2017: "+total);

}
function populationMany(results) {
	

	let totalMale=0;
	let totalFemale=0;
	for(let i=0;i<results.length;i++)
	{
		let data = JSON.stringify(results[i].data);
		let parseData=JSON.parse(data);
		for(let i=0;i<parseData.length;i++)
		{
			totalMale+=parseData[i].males;
			totalFemale+=parseData[i].females;
		}
	}
	console.log('Total males (Canada,Germany,France): '+totalMale);
	console.log('Total females (Canada,Germany,France): '+totalFemale);

}
function population14_15(result) {
	
	let totalMale25=0;
	let totalFemale25=0;
	let year;
	let data = JSON.stringify(result.data);
	let parseData=JSON.parse(data);
	for(let i=0;i<parseData.length;i++)
	{
		if(parseData[i].age==25)
		{
			totalMale25+=parseData[i].males;
			totalFemale25+=parseData[i].females;
			year=parseData[i].year;
		}
	}
	
	console.log("Year: "+year+" Males: "+totalMale25+" Females:"+totalFemale25);

}
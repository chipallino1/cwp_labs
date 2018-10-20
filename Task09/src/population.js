const prom = require('bluebird');
const axios = require('axios');

const urlPop2017='http://api.population.io:80/1.0/population/2017/Belarus/';
const urlPop2014='http://api.population.io:80/1.0/population/2014/Belarus/';
const urlPop2015='http://api.population.io:80/1.0/population/2015/Belarus/';
const urlMany=[ 'http://api.population.io:80/1.0/population/2017/Canada/',
				'http://api.population.io:80/1.0/population/2017/Germany/',
				'http://api.population.io:80/1.0/population/2017/France/'];
const urlMortalityGreeceM='http://api.population.io:80/1.0/mortality-distribution/Greece/male/0/today/';
const urlMortalityGreeceF='http://api.population.io:80/1.0/mortality-distribution/Greece/female/0/today/';

const urlMortalityTurkeyM='http://api.population.io:80/1.0/mortality-distribution/Turkey/male/0/today/';
const urlMortalityTurkeyF='http://api.population.io:80/1.0/mortality-distribution/Turkey/female/0/today/';

const dirs = [
  'dir-1',
  'dir-1/dir-1-1',
  'dir-1/dir-1-2',
  'dir-1/dir-1-2/dir-1-2-1',
  'dir-2/',
  'dir-2/dir-2-1',
  'dir-2/dir-2-2',
  'dir-2/dir-2-1/dir-2-1-1',
  'dir-2/dir-2-2/dir-2-2-1',
  'dir-2/dir-2-1/dir-2-2-2',
  'dir-3',
  'dir-3/dir-3-1',
  'dir-3/dir-3-1/dir-3-2-1',
  'dir-3/dir-3-1/dir-3-3-1'
];

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


prom.props({mortalityGreece:axios.get(urlMortalityGreeceM).then(mortality),mortalityTurkey:axios.get(urlMortalityTurkeyM).then(mortality)})
.then((result)=>{
	console.log("Mortality Greece: "+result.mortalityGreece);
	console.log("Mortality Turkey: "+result.mortalityTurkey);
});

let countries=[];
let allTotal=0;
axios.get('http://api.population.io:80/1.0/countries').then((result)=>{

	//console.log(result);
	let data=[];
	data=JSON.stringify(result.data.countries);
	let parseData=JSON.parse(data);
	
	for(let i=0;i<5;i++)
	{
		//console.log(parseData[i]);
		countries.push(parseData[i]);
	}
	//console.log(countries[0]);
	let allCountries=[];
	for(let i=0;i<countries.length;i++)
	{
		console.log(countries[i]);
		allCountries.push(axios.get('http://api.population.io:80/1.0/population/2017/'+countries[i]+'/'));
	}
	prom.map(allCountries, (item) =>{
	let total=0;
	let data = JSON.stringify(item.data);
		let parseData=JSON.parse(data);
		for(let i=0;i<parseData.length;i++)
		{
			total+=parseData[i].total;
		}
		allTotal+=total;

	}).then(()=>{console.log('Total: '+allTotal);});

});


let fs = prom.promisifyAll(require('fs'));
let allFs=[];
for(let i=0;i<dirs.length;i++)
{
	allFs.push(fs.mkdirAsync(dirs[i]));
}

prom.mapSeries(allFs,function (item) {
	console.log(item);
});



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
function mortality(result) {

	let age;
	let maxMortality=0;
	let data = JSON.stringify(result.data.mortality_distribution);
	let parseData=JSON.parse(data);
	//console.log(parseData.length);
	for(let i=0;i<parseData.length;i++)
	{

		if(parseData[i].mortality_percent>maxMortality)
		{

			age=parseData[i].age;
			maxMortality=parseData[i].mortality_percent;
		}
	}
	return result.config.url + ' age '+age +' mortality '+maxMortality;  
}

function popCountries(results) {
	
	let total=0;
	console.log(results);
	for(let i=0;i<results.length;i++)
	{
		let data = JSON.stringify(results[i].data);
		let parseData=JSON.parse(data);
		for(let i=0;i<parseData.length;i++)
		{
			total+=parseData[i].total;
		}
	}
	console.log('Total: '+total);
}
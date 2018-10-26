const express = require('express');
const app = express();
const fs = require('fs');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/films/readall',(req,res)=>{

	fs.readFile('top250.json',(error,data)=>{
		let parseData=JSON.parse(data);
		parseData.sort(sortByPosition);
		res.send(JSON.stringify(parseData));

	});

});

app.get('/api/films/read/:id',(req,res)=>{
	
	fs.readFile('top250.json',(error,data)=>{
		let parseData=JSON.parse(data);

		for(let i=0;i<parseData.length;i++)
		{
			if(parseData[i].id==req.params.id)
			{
				let sendData=parseData[i];
				res.send(JSON.stringify(sendData));
				break;
			}
		}
		

	});

});

app.post('/api/films/create',(req,res)=>{
	
	parseBodyJson(req,res,(err,payload)=>{

			console.log('create');
		let createFilm={
			id:new Date()+"",
			title:payload.title,
			rating:payload.rating,
			year:payload.year,
			budget:payload.budget,
			gross:payload.gross,
			poster:payload.poster,
			position:payload.position
		};
		fs.readFile('top250.json',(error,data)=>{

			let parseData=JSON.parse(data);
			let flag=false;
			parseData.sort(sortByPosition);
			let lastPosition=parseData[parseData.length-1].position;
			if(createFilm.position>lastPosition)
			{
				createFilm.position=lastPosition+1;
				parseData.push(createFilm);
			}
			else
			{
				for(let i=0;i<parseData.length;i++)
				{
					if(parseData[i].position==createFilm.position || flag)
					{
						parseData[i].position++;
						flag=true;
					}
				}
				parseData.push(createFilm);
			}
			fs.writeFile('top250.json',JSON.stringify(parseData),(err)=>{
				res.send(JSON.stringify(createFilm));
			});

			


		})
		
	})

});

app.post('/api/films/update',(req,res)=>{
	parseBodyJson(req,res,(error,payload)=>{
		fs.readFile('top250.json',(error,data)=>{

		let parseData=JSON.parse(data);
			
			parseData.sort(sortByPosition);
			let lastPosition=parseData[parseData.length-1].position;
			let index=0;
			if(payload.position>lastPosition)
			{
				payload.position=lastPosition;
				for(let i=0;i<parseData.length;i++)
				{
					if(parseData[i].id==payload.id)
					{
						parseData[i].rating=payload.rating;
						parseData[i].year=payload.year;
						parseData[i].budget=payload.budget;
						parseData[i].gross=payload.gross;
						parseData[i].position=payload.position;
						index=i;
						for(let j=index+1;j<parseData.length;j++)
						{
							parseData[j].position--;
						}
						break;
					}
					
				}
				
			}
			else
			{
				for(let i=0;i<parseData.length;i++)
				{
					if(parseData[i].id==payload.id)
					{
						parseData[i].rating=payload.rating;
						parseData[i].year=payload.year;
						parseData[i].budget=payload.budget;
						parseData[i].gross=payload.gross;
						if(payload.position<parseData[i].position)
						{
							for(let j=0;j<i; j++)
							{
								if(parseData[j].position==payload.position)
								{
									for(j;j<i;j++)
									{
										parseData[j].position++;
									}
									break;
								}
							}
						}
						else{

							for(let j=i+1;j<parseData.length;j++)
							{
								if(parseData[j].position==payload.position)
								{
									for(j;j>i;j--)
									{
										parseData[j].position--;
									}
									break;
								}
							}

						}
						parseData[i].position=payload.position;

						index=i;
						break;
					}
				}
				
			}
			fs.writeFile('top250.json',JSON.stringify(parseData),(err)=>{
				res.send(JSON.stringify(parseData[index]));
			});
		});
	});
});

app.post('api/films/delete',(req,res)=>{
	parseBodyJson(req,res,(error,payload)=>{

		fs.readFile('top250.json',(error,data)=>{

			let parseData=JSON.parse(data);
			let deletedItem;
			parseData.sort(sortByPosition);
			let isDeleted=false;
			for(let i=0;i<parseData.length;i++)
			{
				if(parseData[i].id==payload.id && !isDeleted)
				{
					deletedItem=parseData[i];
					parseData.splice(i,1);
					isDeleted=true;
					continue;
				}
				if(isDeleted)
				{
					parseData[i].position--;
				}
			}
			fs.writeFile('top250.json',JSON.stringify(parseData),(err)=>{
				res.send(JSON.stringify(deletedItem));
			})

		})

	});
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
})

function sortByPosition(curr,next) {
	
	if (curr.position > next.position)
    	return 1;
  	else if (curr.position < next.position)
    	return -1;
  	else
    	return 0;

}

function parseBodyJson(req,res, cb) {
  let body = [];

  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();

    let params = JSON.parse(body);

    cb(null, params);
  });
}


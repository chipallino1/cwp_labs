const http = require('http');
const fs=require('fs');
let articles=[];
let comments=[];

const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
  '/sum': sum,
  '/api/articles/readall':readall,
  '/api/articles/create':create,
  '/api/articles/read':read
};

const server = http.createServer((req, res) => {
  //console.log(req);
  parseBodyJson(req, (err, payload) => {
    const handler = getHandler(req.url);

    handler(req, res, payload, (err, result,isJson) => {
      if (err) {
        res.statusCode = err.code;
        res.setHeader('Content-Type', 'application/json');
        res.end( JSON.stringify(err) );

        return;
      }
      if(!isJson)
      {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.end( JSON.stringify(result) );
      }
      else{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.end(result);
      }
    });
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function getHandler(url) {
  return handlers[url] || notFound;
}



function sum(req, res, payload, cb) {
  const result = { c: payload.a + payload.b };

  cb(null, result,false);
}
function readall(req, res, payload, cb) {
  

  
  fs.readFile('articles.json',(error,data)=>{

      cb(null, data,true);

  });
  
}
function create(req, res, payload, cb) {
  
  articles.push(payload);

  fs.writeFile('articles.json',JSON.stringify(articles),(error)=>{
    if(error)
      cb(null,'false',false);
    else
      cb(null,'true',false);

      
  });

}
function read(req, res, payload, cb) {
  // body...
}


function notFound(req, res, payload, cb) {
  cb({ code: 404, message: 'Not found'});
}

function parseBodyJson(req, cb) {
  let body = [];

  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();

    let params = JSON.parse(body);

    cb(null, params);
  });
}
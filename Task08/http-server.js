const http = require('http');

const hostname = '127.0.0.1';
const portHttp = 3000;

const net = require('net');
const portTcp = 8124;

const client = new net.Socket();
//tcp
client.setEncoding('utf8');

client.connect(portTcp, function() {
  console.log('Connected');
 // client.write('\r\nHello, Server!\r\nLove,\r\nClient.\r\n');
});

client.on('data', function(data) {
  console.log(data);
  resMain.statusCode = 200;
  resMain.setHeader('Content-Type', 'application/json');
  resMain.end( data );
  
  });
client.on('close', function() {
  console.log('Connection closed');
});

const handlers = {
  '/workers/add': addWorker,
  '/workers':getWorkers,
  '/workers/remove':removeWorker
};

let reqMain;
let resMain;
const server = http.createServer((req, res) => {
  reqMain=req;
  resMain=res;
  parseBodyJson(req, (err, payload) => {
    const handler = getHandler(req.url);

    handler(req, res, payload, client, (err, result) => {
      if (err) {
        res.statusCode = err.code;
        res.setHeader('Content-Type', 'application/json');
        res.end( JSON.stringify(err) );

        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end( JSON.stringify(result) );
    });
  });
});

server.listen(portHttp, hostname, () => {
  console.log(`Server running at http://${hostname}:${portHttp}/`);
});



function getHandler(url) {
  return handlers[url] || notFound;
}

function addWorker(req, res, payload, client, cb) {
  
  let X=payload.X;
  let sendArgs={'X':X};
  client.write(JSON.stringify(sendArgs)); 

}
function getWorkers(req, res, payload, client, cb) {
    
    let sendArgs={'getAll':true};

    client.write(JSON.stringify(sendArgs));

}
function removeWorker(req, res, payload, client, cb)
{
   let sendArgs={'remove':true,id:payload.id};

    client.write(JSON.stringify(sendArgs));
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
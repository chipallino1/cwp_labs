const http = require('http');
const fs=require('fs');
//let articles=[];
let comments=[];

const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
  '/sum': sum,
  '/api/articles/readall':readall,
  '/api/articles/create':create,
  '/api/articles/read':read,
  '/api/articles/update':update,
  '/api/articles/delete':drop,
  '/api/comments/create':createComment,
  '/api/comments/delete':dropComment
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

let sortField;
function readall(req, res, payload, cb) {
  

  //console.log(1);
  fs.readFile('articles.json',(error,data)=>{

      let articles=JSON.parse(data);
     

      console.log(payload.limit,)
     sortType=payload.sortType;
     sortField=payload.sortField;
     if(sortType==='asc')
      articles.sort(asc);
    else
      articles.sort(desc);
     // console.log(articles);

     let allPages=[];
     let items=[];
     let meta={page:1,pages:1,limit:1,count:1};
     let flag=false;
     let page=1;
     let pages=1;
     let currPage={items:null,meta:null};

     for(let i=0;i<articles.length;i++)
     {
        
          
          if(i%payload.limit==0 && i>=payload.limit)
             {  
             page++;
             pages++;
              meta.pages=pages;
             
              }
          if(page==payload.page)
          {
            items.push(articles[i]);
             meta.page=payload.page;             
             meta.count=articles.length;
             meta.limit=payload.limit;
            
             
             //allPages.push(currPage);
          }
         
          
        
     }

      currPage.items=items;
      currPage.meta=meta;
      cb(null, currPage,false);

  });
  
}
function create(req, res, payload, cb) {
  

  fs.readFile('articles.json',(error,data)=>{
      let articles=[];
      articles=JSON.parse(data);
      articles.push(payload);

       fs.writeFile('articles.json',JSON.stringify(articles),(error)=>{
    if(error)
      cb(null,'false',false);
    else
      cb(null,'true',false);

      
  });
      

  });

}
function update(req, res, payload, cb) {
  
  fs.readFile('articles.json',(error,data)=>{
      let articles=[];
      articles=JSON.parse(data);
      for(let i=0;i<articles.length;i++)
      {
        if(articles[i].id==payload.id)
        {
          articles[i].title=payload.title;
          articles[i].text=payload.text;
          articles[i].date=payload.date;
          articles[i].author=payload.author;

          const result=JSON.stringify(articles);
          fs.writeFile('articles.json',result,(error)=>{
            cb(null,'true',false);
            
          })
          return;
          
        }

      }
      cb(null,'false',false);

    

      
  });

}
function read(req, res, payload, cb) {



  fs.readFile('articles.json',(error,data)=>{

      let articles=[];
      articles=JSON.parse(data);
      for(let i=0;i<articles.length;i++)
    {
      if(articles[i].id==payload.id)
      {
        cb(null,articles[i],false);
       return;
      }
    }
    cb(null,'false',false);

  });

  

}
function drop(req, res, payload, cb) {

  fs.readFile('articles.json',(error,data)=>{

      let articles=[];
      articles=JSON.parse(data);
      for(let i=0;i<articles.length;i++)
    {
      if(articles[i].id==payload.id)
      {
        articles.splice(i,1);
        fs.writeFile('articles.json',JSON.stringify(articles),(error)=>{
          cb(null,'true',false);
        });
        
       return;
      }
    }
    cb(null,'false',false);

  });

}
function createComment(req, res, payload, cb) {
  
  fs.readFile('articles.json',(error,data)=>{

      let articles=[];
      articles=JSON.parse(data);
      for(let i=0;i<articles.length;i++)
    {
      if(articles[i].id==payload.articleId)
      {
        articles[i].comments=[];
        articles[i].comments.push(payload);
        fs.writeFile('articles.json',JSON.stringify(articles),(error)=>{
          cb(null,'true',false);
        });
        
       return;
      }
    }
    cb(null,'false',false);

  });


}
function dropComment(req, res, payload, cb) {
  
  fs.readFile('articles.json',(error,data)=>{

      let articles=[];
      articles=JSON.parse(data);
      for(let i=0;i<articles.length;i++)
    {
      if(articles[i].id==payload.articleId)
      {
        for(let j=0;j<articles[i].comments.length;j++)
        {
          if(articles[i].comments[j].id==payload.id)
          {
               articles[i].comments.splice(j,1);
               fs.writeFile('articles.json',JSON.stringify(articles),(error)=>{
                    cb(null,'true',false);
                });
              return;
         }
      }
        
       
      }
    }
    cb(null,'false',false);

  });

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
    fs.appendFile('log.txt','\n[REQ]---'+req.url+'---'+new Date()+'\n---'+body+'\n',()=>{cb(null, params);});
    
  });
}

function desc(current,next) {

  const handlerFields = {
  'currentid': current.id,
  'nextid':next.id,
  'currenttitle':current.title,
  'nexttitle':next.title,
  'currentauthor':current.author,
  'nextauthor':next.author  
};
  if (handlerFields['current'+sortField] > handlerFields['next'+sortField])
    return -1;
  else if (handlerFields['current'+sortField] < handlerFields['next'+sortField])
    return 1;
  else
    return 0;

}
function asc(current,next) {

  const handlerFields = {
  'currentid': current.id,
  'nextid':next.id,
  'currenttitle':current.title,
  'nexttitle':next.title,
  'currentauthor':current.author,
  'nextauthor':next.author  
};
  if (handlerFields['current'+sortField] > handlerFields['next'+sortField])
    return 1;
  else if (handlerFields['current'+sortField] < handlerFields['next'+sortField])
    return -1;
  else
    return 0;

}
var http = require('http');
var fs=require('fs');
var url=require('url');
function templateHTML(title,list,body){
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>sail - ${title}</title>
    <meta charset="utf-8">
  </head>
  ​
  <body>
    <h1><a href="/">홈</a></h1>
    ${list}
    ${body}
  </body>
  </html>`;
}
function templateList(filelist){
  var list='<ul>';
  var i=0;
  while(i<filelist.length){
    list=list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i=i+1;
  }
  list=list+'</ul>';
  return list;
}
var app = http.createServer(function(request,response){
  var _url=request.url;
  var queryData=url.parse(_url,true).query;
  var pathname=url.parse(_url,true).pathname;
  var title=queryData.id;
  if(pathname==='/'){
    if(queryData.id===undefined){
      fs.readdir('./data','utf8',function(error,filelist){
        var title='홈';
        var description='Hello world';
        var list=templateList(filelist);
        var html = templateHTML(title,list,`<h2>${title}</h2>${description}`);
        response.writeHead(200);
        response.end(html);
      });
    }else{
      fs.readdir('./data','utf8',function(error,filelist){
        fs.readFile(`data/${queryData.id}`,'utf8',function(error,description){
          var title=queryData.id;
          var list=templateList(filelist);
          var html = templateHTML(title,list,`<h2>${title}</h2>${description}`);
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  }else{
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);

// create server
// urlstruct for loading index

const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponse');
const jsonHandler = require('./jsonResponse');

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/success': jsonHandler.getResponse,
  '/badRequest': jsonHandler.getResponse,
  '/unauthorized': jsonHandler.getResponse,
  '/forbidden': jsonHandler.getResponse,
  '/internal': jsonHandler.getResponse,
  '/notImplemented': jsonHandler.getResponse,
  notFound: jsonHandler.getResponse,
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);
  console.log(parsedURL.pathname);

  // check for querys
  const params = query.parse(parsedURL.query);
  // need to pass except type
  const acceptedTypes = request.headers.accept.split(',');

  console.log(acceptedTypes[0]);
  if (urlStruct[parsedURL.pathname]) {
    urlStruct[parsedURL.pathname](request, response, acceptedTypes, parsedURL.pathname, params);
  } else {
    urlStruct.notFound(request, response, acceptedTypes, parsedURL.pathname, params);
  }
};

const port = process.env.PORT || process.env.NODE_PORT || 3000;
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

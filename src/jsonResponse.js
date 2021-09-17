const urlStruct = {
  '/success': 'Success,This is a successful response',
  '/badRequest': 'BadRequest,Missing valid query parameter set to true',
  '/unauthorized': 'Unauthorized,Missing loggedIn query parameter set to yes',
  '/forbidden': 'Forbidden,You do not have access to content.',
  '/internal': 'Internal Error,Internal Server Error. Something wen wrong',
  '/notImplemented': 'Not Implemented,A get request for this page has not been implemented yet. Check again later for updated content.',
};

// return packet with an object, and indication of if request for Json format, a status code
const getPacket = (acceptedTypes, parsedURL, params) => {
  // check the type of id
  let id;
  let message;
  let statusCode;
  let tempArray;
  switch (parsedURL) {
    case '/success':
      statusCode = 200;
      tempArray = `${urlStruct[parsedURL]}`;
      tempArray = tempArray.split(',');
      [id, message] = tempArray;
      break;
    case '/badRequest':
      if (params.valid === 'true') {
        statusCode = 200;
        id = 'Good Request';
        message = 'valid query paremeter is true';
      } else {
        statusCode = 400;
        tempArray = `${urlStruct[parsedURL]}`;
        tempArray = tempArray.split(',');
        [id, message] = tempArray;
      }
      break;
    case '/unauthorized':
      if (params.loggedIn === 'true') {
        statusCode = 200;
        id = 'Authorized';
        message = 'LoggedIn query paremeter is true';
      } else {
        statusCode = 401;
        tempArray = `${urlStruct[parsedURL]}`;
        tempArray = tempArray.split(',');
        [id, message] = tempArray;
      }
      break;
    case '/forbidden':
      statusCode = 403;
      tempArray = `${urlStruct[parsedURL]}`;
      tempArray = tempArray.split(',');
      [id, message] = tempArray;
      break;
    case '/internal':
      statusCode = 500;
      tempArray = `${urlStruct[parsedURL]}`;
      tempArray = tempArray.split(',');
      [id, message] = tempArray;
      break;
    case '/notImplemented':
      statusCode = 501;
      tempArray = `${urlStruct[parsedURL]}`;
      tempArray = tempArray.split(',');
      [id, message] = tempArray;
      break;
    default:
      statusCode = 404;
      id = 'Resource Not Found';
      message = 'The page you are looking for was not found';
      break;
  }

  // if json or xml object
  let object;
  let isJson = true;

  if (acceptedTypes[0] === 'text/xml') {
    isJson = false;
    // write xml
    object = `<response><b>${id}</b><p>${message} (XML)</p></response>`;
  } else {
    // default to json
    object = {
      id: `${id}`,
      message: `${message}`,
    };
  }
  console.log(`the id: ${id}`);
  const packet = {
    object,
    isJson,
    statusCode,
  };

  return packet;
};

const getResponse = (request, response, acceptedTypes, parsedURL, params) => {
  const packet = getPacket(acceptedTypes, parsedURL, params);
  if (packet.isJson) {
    response.writeHead(packet.statusCode, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(packet.object));
  } else {
    response.writeHead(packet.statusCode, { 'Content-Type': 'text/xml' });
    response.write(packet.object);
  }
  response.end();
  console.log(packet.object);
};

module.exports = {
  getResponse,
};

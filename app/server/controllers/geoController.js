var http = require('http');
var traverse = require('traverse');


function GeoController() {}

GeoController.prototype.apiGetGeoLocation = function(req, res) {

  var params = {};
  params['address'] = traverse(req).get(['query','address']);
  params['city'] = traverse(req).get(['query','city']);
  params['output'] = 'json';

  var options = {
    host: 'api.map.baidu.com',
    path: buildUrl('/geocoder', params),
    method: 'GET'
  };

  http.request(options, function(response){

    console.log("Response status: " + response.statusCode);

    //do something with chunk
    var pageData = "";
    response.setEncoding('utf8');
    //stream the data into the response
    response.on('data', function (chunk) {
      pageData += chunk;
    });

    //write the data at the end
    response.on('end', function(){
      if (pageData) {
        res.json({
          success: 1,
          coordinates: {
            x: traverse(JSON.parse(pageData)).get(['result','location','lng']),
            y: traverse(JSON.parse(pageData)).get(['result','location','lat'])
          }
        });
      } else {
        res.json({
          success: 0,
          error: 'empty pageData!'
        });
      }
    });
  }).end();
}

function buildUrl(url, parameters){
  var qs = "";
  for(var key in parameters) {
    var value = parameters[key];
    qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
  }
  if (qs.length > 0){
    qs = qs.substring(0, qs.length-1); //chop off last "&"
    url = url + "?" + qs;
  }
  return url;
}

module.exports = GeoController;

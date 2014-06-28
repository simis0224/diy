var http = require('http');
var traverse = require('traverse');


function GeoController() {}

GeoController.prototype.apiGetGeoLocation = function(req, res) {

  var address = traverse(req).get(['query','address']);
  var city = traverse(req).get(['query','city']);

  var options = {
    host: 'api.map.baidu.com',
    path: '/geocoder?address=' + address + '&output=json&key=XC4na07DTIFVoacSkYjEetPr&city=' + city,
    method: 'GET'
  };

  http.get(options, function(response){
    //do something with chunk
    var pageData = "";
    response.setEncoding('utf8');
    //stream the data into the response
    response.on('data', function (chunk) {
      pageData += chunk;
    });

    //write the data at the end
    response.on('end', function(){

      res.json({
        success: 1,
        location: {
          x: traverse(JSON.parse(pageData)).get(['result','location','lng']),
          y: traverse(JSON.parse(pageData)).get(['result','location','lat'])
        }
      });
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
    console.log( e.stack );
    res.json({
      success: 0,
      error: e
    });
  });
}

module.exports = GeoController;

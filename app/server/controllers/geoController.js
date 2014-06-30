var http = require('http');
var traverse = require('traverse');


function GeoController() {}

GeoController.prototype.apiGetGeoLocation = function(req, res) {

  var address = traverse(req).get(['query','address']);
  var city = traverse(req).get(['query','city']);

  var options = {
    host: 'api.map.baidu.com',
    //path: '/geocoder?address=' + address + '&output=json&key=XC4na07DTIFVoacSkYjEetPr&city=' + city,
    path: '/geocoder?address=人民广场&output=json&key=XC4na07DTIFVoacSkYjEetPr&city=上海'
  };

  console.log('host: ' + options.host);
  console.log('path: ' + options.path);

  http.get(options, function(response){

    console.log("Got response: " + response.statusCode);

    //do something with chunk
    var pageData = "";
    response.setEncoding('utf8');
    //stream the data into the response
    response.on('data', function (chunk) {
      pageData += chunk;
    });

    //write the data at the end
    response.on('end', function(){

      console.log('pageData:' + pageData);

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

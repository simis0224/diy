var fs = require('fs');
var crypto = require('crypto');
var paths = require('../constants/paths');
var util = require('util');

function apiUploadImage(req, res, next) {
  // TODO
  var url = handleFileUpload(req);
  res.json({
    success: 1,
    imageUrl: url
  });
}

function handleFileUpload(req) {
  if(!req.files || !req.files.file || !req.files.file.name) {
    return req.body.currentPicture || '';
  }
  var data = fs.readFileSync(req.files.file.path);
  var fileName = req.files.file.name;
  var uid = crypto.randomBytes(10).toString('hex');
  var dir = paths.UPLOAD_IMAGE_DIR + uid;
  fs.mkdirSync(dir, '0777');
  fs.writeFileSync(dir + "/" + fileName, data);
  return util.format(paths.UPLOAD_IMAGE_ACCESS_SRC, uid, fileName);
}

module.exports.apiUploadImage = apiUploadImage;
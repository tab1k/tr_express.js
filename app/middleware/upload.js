const multer = require("multer");

const imageFilter = (req, file, cb) => {
  cb(null, true);
};
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "../../../upload/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;
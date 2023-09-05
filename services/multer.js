const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:\\Users\\Admin\\Desktop\\js_gitlab_training\\uploads');
    // cb(null, 'C:\\Users\\Admin\\Desktop\\asdsadad\\uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10 // 1 mb => 1024 kb AND 1 kb = 1024 byte
  },
  fileFilter
});

module.exports = { upload };

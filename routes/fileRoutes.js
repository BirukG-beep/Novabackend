const express = require("express");
const router = express.Router();

const {
  getFileGarbage,
  deleteFileGarbage,
  postFileGarbage
} = require("../controllers/fileController");

router.get("/", getFileGarbage);

router.delete("/",deleteFileGarbage)

router.post('/' ,postFileGarbage)
module.exports = router;
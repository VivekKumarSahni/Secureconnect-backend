const express = require("express");
const { fetchAllAgencies , updateAgency,updateAgencyDelRes,fetchLoggedInAgency} = require("../controller/Agency");

const router = express.Router();

router.get("/", fetchAllAgencies)
      .get("/own", fetchLoggedInAgency)
      .patch("/:id", updateAgency)
      .delete("/:id", updateAgencyDelRes);

exports.router = router;

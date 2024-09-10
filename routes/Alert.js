const express = require('express');
const { fetchAllAlerts ,addAlert} = require('../controller/Alert');


const router = express.Router();

router.get('/', fetchAllAlerts)
.post('/',addAlert);
       

exports.router = router;
const { Agency } = require("../model/Agency")
const jwt = require('jsonwebtoken');
const SECRET_KEY = "SECRET_KEY";

exports.fetchAllAgencies = async (req,res)=>{

    try{
        const agencies = await Agency.find({}).exec();
        res.status(200).json(agencies);
    }
    catch(err){
        res.status(400).json(err);

    }
}
exports.updateAgency = async (req, res) => {
    const { id } = req.params;
    // const { location, quantity, type, name } = req.body;
    // console.log(location, quantity, type, name );
    try {
      const agency = await Agency.findById(id);
      agency.resources.push(req.body);
      const updatedAgency = await agency.save();
      res.status(200).json(updatedAgency);
    } catch (err) {
      res.status(400).json(err);
    }
  };
exports.updateAgencyDelRes = async (req, res) => {
    const { id } = req.params;
    const { resourceId } = req.body;
    // console.log({id,resourceId});
    try {
      const agency = await Agency.findById(id);

      agency.resources = agency.resources.filter(resource => resource._id.toString() !== resourceId);
    const updatedAgency = await agency.save();
      res.status(200).json(updatedAgency);
    } catch (err) {
      res.status(400).json(err);
    }
  };
exports.fetchLoggedInAgency = async (req, res) => {
  const token = req.headers['authorization'];
  if(token){
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const agency = await Agency.findById(decoded.id);

      res.status(200).json(agency);
    } catch (err) {
      res.status(401).json(err);
    }
  }else {
    res.status(401).send('Unauthorized: No token provided');
  }
  };
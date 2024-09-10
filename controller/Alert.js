const { Alert } = require("../model/Alert")


exports.fetchAllAlerts = async (req,res)=>{

    try{
        const alerts = await Alert.find({}).exec();
        res.status(200).json(alerts);
    }
    catch(err){
        res.status(400).json(err);

    }
}
exports.addAlert = async (req, res) => {
    // this product we have to get from API body
    const alert = new Alert(req.body);
    try {
      const doc = await alert.save();
      res.status(201).json(doc);
    } catch (err) {
      res.status(400).json(err);
    }
  };
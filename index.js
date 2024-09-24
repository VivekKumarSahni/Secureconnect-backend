const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const SECRET_KEY = "SECRET_KEY";
// const { Message } = require("./model/Agency");
const jwt = require('jsonwebtoken');
const Message = require("./model/Message");


const authRouter = require('./routes/Auth');
const agencyRouter = require('./routes/Agency');
const alertRouter = require('./routes/Alert');
const ws = require("ws");

const {Redis} = require("ioredis");
const { fetchLoggedInAgency } = require('./controller/Agency');


// middlewares

const Auth = (req,res, next)=>{
        const token = req.get('Authorizaton').split('Bearer')[1];
        // console.log(token);
        try{
            var decoded = jwt.verify(token,SECRET_KEY);
            if(decoded.govtId){
                next();
            }
            else{
                res.sendStatus(401);
            }

        }catch(err){
            res.sendStatus(401);
        }
}
//"https://secureconnect-vivek.netlify.app",
app.use(cors({
    origin: ["https://secureconnect.vercel.app/",'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Include cookies if any in the request
  }));


  app.use(express.json()); // to parse req.body
  app.use('/auth', authRouter.router);
  app.use('/agency', agencyRouter.router);
  app.use('/alerts', alertRouter.router);



main().catch(err=> console.log(err));

async function main(){
   //mongodb+srv://vsahni674:4tAdqiOeAcPgdIzP PURMU7Rs51U50H8t@cluster0.8bzqj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  //mongodb+srv://vsahni674:PURMU7Rs51U50H8t@cluster0.eonu2g9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
  //aFaAkoqkYUQ5y4wP wQ8vaXcLFXXHO4DW
    await mongoose.connect("mongodb+srv://vsahni674:eTVekLjGczzzOVJ5@cluster0.pcxyfvy.mongodb.net/MernChat?retryWrites=true&w=majority");
    console.log('database connected');
}

app.get('/', (req,res)=>{
        res.json({status:"success"});
})

async function getUserDataFromRequest(token) {
  
       const decoded = jwt.verify(token, "SECRET_KEY");
  //  console.log(decoded);
   return decoded;
    } 
  


    app.get('/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const token = req.headers['authorization'];
    const userData = await getUserDataFromRequest(token); // Fetch user data
    const ourUserId = userData.id;

    // const messages = await Message.find({
    //   sender: { $in: [userId, ourUserId] },
    //   recipient: { $in: [userId, ourUserId] },
    // }).sort({ createdAt: 1 });

    res.json("success"); // Respond with the messages
  } catch (err) {
    res.status(401).json({ error: err.message || 'An error occurred' });
  }
});
// server.get('/messages/:userId',async (req,res)=>{
//   const {userId}= req.params;
//   const userData = await getUserDataFromRequest(req);
//   const ourUserId = userData._id;
//   const messages= await Message.find({
//    sender: {$in:[userId,ourUserId]},
//    recipient: {$in:[userId,ourUserId]},
//   }).sort({createdAt:1});
//   res.json(messages);
//  })

const server = app.listen(8080, ()=>{
    console.log("server started");
})


const wss = new ws.WebSocketServer({ server }); //ws is just a library

wss.on("connection", (connection, req) => {

   
  function notifyAboutOnlinePeople(){

    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            id: c.id,
            deptName: c.deptName,
          })), 
        })
      );
    });
   
  }
  // const cookies = req.headers.cookie;
  // if (cookies) {
  //   // console.log(cookies);
  //   const tokenCookieString = cookies
  //     .split(";")
  //     .find((str) => str.startsWith("token"));
  //   if (tokenCookieString) {
  //     const token = tokenCookieString.split("=")[1];
  //     if (token) {
  //       jwt.verify(token, jwtSecret, {}, (err, userData) => {
  //         if (err) throw err;
  //         const { userId, username } = userData;
  //         connection.userId = userId;
  //         connection.username = username;
  //       }); 
  //     }
  //   }}
  const params = new URLSearchParams(req.url.split('?')[1]);
  const token = params.get('token');
  // console.log(token);

  if(token){
     const {id,deptName} = jwt.verify(token, "SECRET_KEY");
     console.log(id, deptName);
              connection.id = id;
          connection.deptName = deptName;
  }
  
  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, alert , file } = messageData;
    // if(file)
    // console.log({file});
    if(alert){
      [...wss.clients]
      .forEach(c => c.send(JSON.stringify({
        alert,
      })));

    }
    if (recipient && text) {

      const messageDoc = await Message.create({
        sender:connection.id,
        recipient,
        text,
       
      });
      console.log('created message');
      [...wss.clients]
        .filter(c => c.id === recipient)
        .forEach(c => c.send(JSON.stringify({
          text,
          sender:connection.id,
          recipient,
           _id: messageDoc._id,
        }))); //same person can send messages to many people(recepient) one by mobile other by laptop
    }
  }); 
  notifyAboutOnlinePeople();
});

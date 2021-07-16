const express = require('express');
const app = express();
// const port = 3002;
// const port = process.env.PORT || 3002;
const moment = require('moment-timezone');
const Umpatan = require('./models/umpatan');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const io = require("socket.io")(3001, {
    cors: {
        origin: ['http://localhost:8080']
    }
});

app.use(cors())
app.use(bodyParser.json())

// get data
const returnUmpatan = async () => {
    const getData = await Umpatan.find();
    io.emit('updateUmpatan', {
        count: getData.length,
        umpatans: getData.reverse().slice(0, 5)
    })
}


setInterval(() => {
    const umpatans = ["BANGSAD", "TAI", "anjing", "babi", "BABII", "Asu", "ASUU", "Bangsatt!!", "Kampret", "ANJJGGG", "ANJINGGG", "Anjing", "ANJING", "asu", "TAU AH", "NJIRRR", "AJWJKWK", "BABIIII!!", "BANGKEEE", "bangke", "SHIT", "shit", "fuckkk"];
    const newUmpatan = new Umpatan({
        umpatan: umpatans[Math.floor(Math.random() * umpatans.length)],
        date: moment.tz("Asia/Makassar").format(),
    });
    newUmpatan.save(); 
}, 254231)

//connect to mongodb
mongoose.connect(
  "mongodb+srv://nabung:nabung123@nabung1.dkgbr.mongodb.net/umpatandb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function(err){
    if(err){
        throw err
    }
    console.log('Database connected')
    
    io.on('connection',(socket) => {
        console.log('user connected')
        // first connect
        returnUmpatan();
        
        socket.on("sendUmpatan", umpatan => {
            const newUmpatan = new Umpatan({
                umpatan: umpatan,
                date: moment.tz("Asia/Makassar").format(),
            });
            newUmpatan.save();
        })
    })

    Umpatan.watch().on('change',(change)=>{
        console.log('umpatan ditambahkan')
        returnUmpatan();
    })
    
})

// http.listen(3002, () => {
//   console.log(`App listening at http://localhost:${3002}`);
// })

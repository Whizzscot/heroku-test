const os = require("os");
const path = require("path");
const express = require("express");
const socket = require("socket.io");

const PORT = process.env.PORT || 5000;

const app = express()
.set('view engine', 'ejs')
.use("/assets",express.static(path.join(__dirname,"game/assets")))
.use("/scripts",express.static(path.join(__dirname,"game/scripts")))
.all("*",(req,res)=>{
    res.render(path.join(__dirname, "game/game.ejs"));
})
;

const server = app.listen(PORT, ()=>{
    if(process.env.PORT == 5000) return console.log("HTTP Server Online.");
    const address = Object.values(os.networkInterfaces())
    .flat()
    .filter(({ family, internal }) => family === "IPv4" && !internal)
    .map(({ address }) => address);
    console.log(`
    HTTP Server Online.
    Port: ${PORT}
    Local Address: http://localhost:${PORT}
    IPv4 Network address: ${address}
    Full External Address: http://${address}:${PORT}
    `);
});

const io = socket(server)
.on('connection', socket=>{
    console.log(`New socket connection with id "${socket.id.substr(0,4)}..."`);
    socket.on('disconnect',()=>{
        console.log(`Socket "${socket.id.substr(0,4)}..." disconnected.`);
    })
})
;
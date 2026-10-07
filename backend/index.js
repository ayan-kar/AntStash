import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import InitRepo from "./controllers/init.js";
import AddFile from "./controllers/add.js";
import CommitChange from "./controllers/commit.js";
import PullFile from "./controllers/pull.js";
import PushFile from "./controllers/push.js";
import RevertChange from "./controllers/revert.js";
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import mainRouter from "./routes/mainRouter.js";

import http from "node:http"

import dns from "node:dns"
dns.setServers(["1.1.1.1","8.8.8.8"])

import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config()

import {Server} from "socket.io"

yargs(hideBin(process.argv))
    .command("starts", "Start the Server", {}, startServer)
    .command("init", "Initialise a New Reposetory", {}, InitRepo)
    .command("add <file>", "Add a file to Reposetory", (yargs) => {
        yargs.positional("file", {
            describe: "file to add to the staging area",
            type: "string"
        })
    }, (argv) => {
        AddFile(argv.file)
    })
    .command("commit <message>", "Commit the Stage Files", (yargs) => {
        yargs.positional("message", {
            describe: "Commit Message",
            type: "string"
        })
    }, (argv) => {
        CommitChange(argv.message)
    })
    .command("push", "Pushing To Reposetory", {}, PushFile)
    .command("pull", "Pulling From Reposetory", {}, PullFile)
    .command("revert <commmitID>", "Revert the changes to a specific Commit ID", (yargs) => {
        yargs.positional("commmitID", {
            describe: "Revert Changes Back to a specific Commit",
            type: "string"
        })
    }, (argv) => {
        RevertChange(argv.commmitID)
    }
    )
    .demand(1, "Pass atleast one command")
    .help().argv;


function startServer() {
    const app= express()
    const httpserver=http.createServer(app)
    const io =new Server (httpserver,{
        cors:{
            origin:"*",
            methods:["GET","POST"]
        }
    });

    const port =process.env.PORT || 3000;

    app.use(bodyParser.json())
    app.use(express.json())
    app.use(cors({origin:"*"}));
    app.use("/",mainRouter)

    const mongoURI = process.env.MONGODB_URL;
    mongoose.connect(
        mongoURI)
    .then(()=>{
        console.log("Databse Connected")
    })
    .catch((error)=>{
        console.log("Databse not  Connected",error)
    }) //* the connection succeeds, Mongoose stores that connection internally as its default connection.

    io.on("connection",(socket)=>{
        socket.on("JoinRoom",(userId)=>{
           let user=userId;
            console.log("====");
            console.log(user);
            console.log("====");
            socket.join(userId)
        })
    })

    const db = mongoose.connection
    db.once("open",async()=>{
        console.log("CRUD operations called");
    }) ///* This does not create a new connection.   It simply gives you access to the connection object that was already created


    httpserver.listen(port,()=>{
        console.log(`server is Running on port ${port}`)
    })
}
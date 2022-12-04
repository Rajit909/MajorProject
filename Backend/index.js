import mongoose from "mongoose";

import app from "./app";

import  config  from "./config/index";

//Create a fn
//Run a fn

(async() => {
    try {
        await mongoose.connect(config.MONGODB_URL)
        console.log("DB Connected");

        app.on('error', (error)=>{
            console.log("ERROR ", error)
            throw error
        })

        const onListenig = ()=>{
            console.log(`listenig on ${config.PORT}`)
        }

        app.listen(config.PORT,onListenig)

    } catch (error) {
        console.log("ERROR ",error)
        throw error
    }
})()

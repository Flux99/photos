import express from "express";
import {json} from "body-parser";
import path from "path";
import multer from "multer";
import mongoose from "mongoose";
import {createPublicSingles,createArrayPublic,findByOwnerPublic} from "./Photo-helper";
import fs from "fs";

///////////////////////////////////////////////////// DB CONNECTION ////////////////////////////////////////////////
const uri='paste mongo uri';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };
  
  mongoose.connect(uri, options);
  const db = mongoose.connection;
  db.once("open", (_) => {
    console.log("Database connected:", uri);
  });
  db.on("error", (err) => {
    console.error("connection error:", err);
  });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const app =express();
const PORT = 3000


app.use(express.json());
app.use("/Images",express.static('Images'));
app.set("view engine", "ejs");

app.use(express.static("public"));


var storage= multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./Images/');
    },
    filename: function(req,file,cb){
        var d = new Date();
        var n = d.toISOString();
        cb(null,n+ file.originalname);
    }
});
const fileFilter=(req:any,file:any,cb:any)=>{
if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' ){
    cb(null,true)
}else{
    cb(new Error('ONLY jpeg or png...'),false)
}
}
var upload=multer({
    // dest:'Images/'
    storage:storage,
    limits:{
        fileSize:1024 * 1024 * 5
    },
   fileFilter:fileFilter
});

//////////////////////////////////////////////////////// APIs ///////////////////////////////////////////////////////////
app.get("/",(req,res)=>{
    res.render("upload");
});

app.get("/viewPublic",async (req,res)=>{
    const response = await findByOwnerPublic();
    if(!response) console.log("response does not exist");
    console.log("response",response);
    var userData:string[]=[];
    response.forEach(function(data:any){
        data.photos.forEach((element:any) => {
            console.log("element",element.path);
            userData.push(element.path);
        });
    });
    console.log("userData",userData);
    
    res.render("viewPublic",{userData:userData});
})
app.get("/uploadarray",(req,res)=>{
    res.render("uploadarray");
});

 app.post("/upload",upload.single('myimage'),async (req,res)=>{
    console.log("req.file line 37",req.file);
    const response=  await createPublicSingles("abc",req.file);
    console.log("response",response);
    
    res.send({data:response});
});

app.post("/uploads",upload.array('myarray',25),async (req,res)=>{
    console.log("req.file uploadarray line 37",req.files);
    const response= await createArrayPublic("abc",req.files);
    res.send({data:req.files});
});


app.listen(PORT,()=>{
console.log(`server running on ${PORT}`);

});
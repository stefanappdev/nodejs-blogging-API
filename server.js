const express=require('express');
const ejs=require('ejs');
const mysql=require('mysql');
const app=express();
const path=require('path');
const { error } = require('console');
const PORT=8000;

//middleware
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.set('view engine','ejs')

//mysql
const pool=mysql.createPool({
    connectionLimit:10,
    host:"localhost",
    user:"root",
    database:"blogs"
});


pool.getConnection((error,connection)=>{
    if (error){
        throw error
    }
    console.log('connected to Database as:'+connection.threadId)
})






app.get("/",(request,response)=>{
    response.status(200).render('index')
})

app.get("/login",(request,response)=>{
    response.status(200).render('login')
})

app.get("/signup",(request,response)=>{
    response.status(200).render('signup')
})


app.use((request,response)=>{
      response.status(404).render('404')
})




app.listen(PORT,()=>{
    console.log('Server started on port:'+PORT)
})
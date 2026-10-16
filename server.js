const express=require('express');
const ejs=require('ejs');
const mysql=require('mysql');
const crypto=require('crypto')
const app=express();
const path=require('path');
const { title } = require('process');
const { json } = require('stream/consumers');
//const userRouter=require("./routes/users.js")
const PORT=8000;
let users=[];

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
    response.status(200).render('index',{title:"Home"})
})


 
app.route('/admin/users')
.get((request,response)=>{
    pool.getConnection((error,connection)=>{
        if(error){
            throw error
        }

        connection.query("SELECT * FROM users",(error,data)=>{

            connection.release()

            if(error){
               console.log(error)
            }

            console.log(data)
            response.status(200).send(data)
        })

    });

})

.post((request,response)=>{
   
    
    pool.getConnection((error,connection)=>{
        if(error){throw error}

        let userId= Math.floor(Math.random()*700);
        console.log(request.body)
        const params={
            userId:userId,
            firstName:request.body.firstName,
            lastName:request.body.lastName,
            email:request.body.email,
            password:request.body.password
        };
        
        
        
    connection.query('INSERT INTO users (userId,firstName,lastName,email,password) VALUES (?,?,?,?,?)',
        
        [params.userId,params.firstName,params.lastName,params.email,params.password],
        
        (error,data)=>{
        
        connection.release()

        if(!error){
           
            response.status(200).redirect("/")
        }else{
            console.log(error)
        } })


    })
})




app.get("/users/login",(request,response)=>{
    response.status(200).render('login',{title:'login'})
})

app.get("/users/signup",(request,response)=>{
    response.status(200).render('signup',{title:'signup'})
})

app.get("/users/:username",(request,response)=>{
    response.status(200).render('users/profile',{title:request.params.username})
})


app.use((request,response)=>{
      response.status(404).render('404',{title:"404 page"})
})




app.listen(PORT,()=>{
    console.log('Server started on port:'+PORT)
})



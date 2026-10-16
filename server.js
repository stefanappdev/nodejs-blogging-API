const express=require('express');
const ejs=require('ejs');
const mysql=require('mysql');
const crypto=require('crypto')
const app=express();
const path=require('path');
const { title } = require('process');
//const userRouter=require("./routes/users.js")
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

 
app.route('/users')
.get((request,response)=>{
    pool.getConnection((error,connection)=>{
        if(error){
            throw error
        }

        connection.query("SELECT * FROM users LIMIT 10",(error,data)=>{

            connection.release()

            if(error){
               console.log(error)
            }

            console.log(data)
            response.status(200).render('users/users',{title:"Users",data:data})
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
            console.log(data)
           
            response.status(200).redirect("/users")
        }else{
            console.log(error)
        } })


    })
})

.put((request,response)=>{
    response.render('users/users.ejs')
})

.delete((request,response)=>{
    response.render('users/users.ejs')
})





app.use((request,response)=>{
      response.status(404).render('404')
})




app.listen(PORT,()=>{
    console.log('Server started on port:'+PORT)
})



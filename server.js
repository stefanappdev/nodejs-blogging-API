const express=require('express');
const ejs=require('ejs');
const mysql=require('mysql');
const crypto=require('crypto')
const app=express();
const path=require('path');

//const cookieParser=require('cookie-parser');
//const userRouter=require("./routes/users.js")
const PORT=8000;
let users=[];

//middleware
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}));
//app.use(cookieParser())
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





 
app.route('/users')
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

           
            response.status(200).send(data)
        })

    });

})

.post((request,response)=>{
   
    
    pool.getConnection((error,connection)=>{
        if(error){throw error}

        let userId= crypto.randomUUID();
        const params={
            userId:userId,
            email:request.body.email,
            username:request.body.username,
            password:request.body.password
        };
        
        console.log(params)

        
    connection.query('INSERT INTO users (userId,email,username,password) VALUES (?,?,?,?)',
        
        [params.userId,params.email,params.username,params.password],   
        (error,data)=>{
        
        connection.release()

        if(!error){
           console.log(data)
           response.status(200).send(data)

        }else{
             console.log(error)
        } })


    })
})


app.route("/users/:username")


app.get("/login",(request,response)=>{
    response.status(200).render('login',{title:'login'})
})

app.get("/signup",(request,response)=>{
    response.status(200).render('signup',{title:'signup'})
})



app.use((request,response)=>{
      response.status(404).render('404',{title:"404 page"})
})




app.listen(PORT,()=>{
    console.log('Server started on port:'+PORT)
})



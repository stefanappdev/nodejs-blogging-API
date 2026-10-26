const express=require('express');
const ejs=require('ejs');
const mysql=require('mysql');
const crypto=require('crypto')
const app=express();
const cookieParser=require('cookie-parser')
const path=require('path');
const { error } = require('console');


//const userRouter=require("./routes/users.js")
const PORT=8000;
let users=[];

//middleware
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
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


app.route("/users/:username/profile")
.get((request,response)=>{
    if(request.params.username){
        response.status(200).render("profile.ejs",{title:request.params.username})
    }
})


/*
app.route("/blogs/:username")
.get((request,response)=>{
    if(request.params.username){
        response.status(200).render("blogs.ejs",{title:request.params.username})
    }
})*/

app.route('/sessions')

.post((request,response)=>{
     let status;

    async function checkCredentials(){
           
            await fetch('http://localhost:8000/users')
            .then(response=>response.json())
            .then(users=>{
                let matchingUser=users.find(user=>{
                    if(user.username===request.body.username&&user.password===request.body.password){
                        return user
                    }
                })
                if(matchingUser){
                   status=200;
                }else{
                    status=401;
                }
            })
    } 
    
    checkCredentials()
    
    
    let username=request.body.username;
    let sessionId=crypto.randomUUID();
    let cookieOptions={
        expires:new Date(Date.now()+864000),
        maxAge:2*24*3600*1000,
        sameSite:true
    }
    let params=[sessionId,username,cookieOptions.expires]


    pool.getConnection((error,connection)=>{
        if(error){
            throw error
        }


    connection.query("INSERT INTO sessions (sessionId,username,expiresAt) VALUES  (?,?,?)",
        params,(error,data)=>{

            connection.release()

            if(error){
                console.log(error)
            }else{
                
                if(status===200){
                     response.cookie('username',JSON.stringify({username}),cookieOptions)
                    response.status(200).send({data:data,msg:"Login sucessful",status:200})
                   
                }else if(status===401){
                     response.status(401).send({status:401,msg:'Please check your username or password'})
                }
            }
        }
    )


    })
})


.delete((request,response)=>{
    let user=request.params.username;
    pool.getConnection((error,connection)=>{
        if(error){throw error};
        
        connection.query('DELETE FROM sessions WHERE username = ?',[user],(error,data)=>{
            connection.release();
            if(error){console.log(error)}
            response.status(200).send({data:data,msg:'Logout successful',status:200})
        })
    }) 
})










app.route("/login")
.get((request,response)=>{
    response.status(200).render('login',{title:'login'})
})


app.get("/signup",(request,response)=>{
    response.status(200).render('signup',{title:'signup'})
})




app.route('/logout')
.get((request,response)=>{
    response.status(200).render('logout',{title:'logout'})
})






app.use((request,response)=>{
      response.status(404).render('404',{title:"404 page"})
})




app.listen(PORT,()=>{
    console.log('Server started on port:'+PORT)
})



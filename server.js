const express=require('express');
const ejs=require('ejs');
const mysql=require('mysql');
const crypto=require('crypto')
const app=express();
const cookieParser=require('cookie-parser')
const path=require('path');
const { error } = require('console');
const { constants } = require('buffer');


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
    response.status(200).render('index',{pageName:"Home",user:""})
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
        response.status(200).render("profile.ejs",{pageName:'profile page',user:request.params.username})
    }
})



app.route("/blogs/:username/postblogs")
.get((request,response)=>{
    if(request.params.username){
        response.status(200).render("postblogs.ejs",{pageName:'add blogs',user:request.params.username})
    }
})



app.route('/blogs/:username')
.get((request,response)=>{
    pool.getConnection((error,connection)=>{
        if(error){throw error}
        connection.query('SELECT * FROM userblogs WHERE user = ?',[request.params.username],(error,data)=>{
            connection.release();

            if(error){
                console.log(error)
            }else{
                response.status(200).render("blogs.ejs",{pageName:`${request.params.username} blogs`,blogs:data,user:request.params.username})
            }
        })
    })
})

.post((request,response)=>{

    let blog_id=crypto.randomUUID();

    console.log(request.body)
    let params=[blog_id,
        request.body.blog_content,
        request.body.user,
        request.body.Dateposted,
        request.body.blog_subject]

    pool.getConnection((error,connection)=>{
        if(error){throw error};
        connection.query('INSERT INTO userblogs (blog_id,blog_content,user,postedOn,blog_subject) VALUES (?,?,?,?,?)',params,
        (error,data)=>{
            connection.release();
            if(error){
                 response.status(404).send({data:data,msg:'Error occured while attempting to post blog ',status:404})
            }else{
                response.status(200).send({status:200,data:data,msg:"the new blog was posted"});
            }
        })
    })
})






app.route('/blogs/:user/:id')
.get((request,response)=>{
    let blog_id=request.params.id;
    let user=request.params.user;
    

    pool.getConnection((err,connection)=>{
        if(err){throw err};
        connection.query('SELECT * FROM userblogs WHERE blog_id=? AND user=?',
        [blog_id,user],(err,data)=>{
            connection.release();
            if(err){
               console.log(err)
            }else{
                
                response.status(200).render('blogDetails.ejs',{pageName:'Blog Details',blogs:data,user:user});
            }
        })
    })
})



.patch((request,response)=>{

    
    let params=[
        request.body.blog_content,
        request.body.blog_subject,
        request.body.user,
        request.body.blog_id]

    pool.getConnection((error,connection)=>{
        if(error){throw error};
        connection.query('UPDATE userblogs SET blog_content=?,blog_subject=? WHERE user=? AND blog_id=?',params,
        (error,data)=>{
            connection.release();
            if(error){
                throw(error)
            }else{
                response.status(200).send({status:200,data:data,msg:"Your blog was updated"});
            }
        })
    })
})




.delete((request,response)=>{
    console.log(request.body)
    let blog_id=request.body.blog_id;
    let user=request.body.user;


    pool.getConnection((error,connection)=>{
        if(error){throw error};
        
        connection.query('DELETE FROM userblogs WHERE blog_id=?',[blog_id],(error,data)=>{
            connection.release();
            if(error){
                 response.status(404).send({status:404,msg:"unable to delete blog due to an error"})
            }
            console.log(data)
            response.status(200).send({status:200,data:data,msg:"blog deleted sucessfully"})
        })
    }) 
})








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
    response.status(200).render('login',{pageName:'login',user:''})
})


app.get("/signup",(request,response)=>{
    response.status(200).render('signup',{pageName:'signup',user:''})
})




app.route('/logout')
.get((request,response)=>{
    response.status(200).render('logout',{pageName:'logout',user:''})
})






app.use((request,response)=>{
      response.status(404).render('404',{pageName:'Error 404',user:''})
})




app.listen(PORT,()=>{
    console.log('Server started on port:'+PORT)
})



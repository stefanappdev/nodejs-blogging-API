const express=require('express');
const ejs=require('ejs')
const app=express();
const path=require('path')
const PORT=8000;

app.use(express.static(path.join(__dirname,'public')))
app.set('view engine','ejs')

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
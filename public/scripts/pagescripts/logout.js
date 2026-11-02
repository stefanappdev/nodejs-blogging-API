



   function handleLogout(event){
   event.preventDefault()
   let user="";
   let sessionId='';

   function parseCookie(cookieName){
      let cookies=document.cookie.split('; ');
      for(let cookie of cookies){
         let [name,...rest]=cookie.split("=");
         if(name===cookieName){
               return decodeURIComponent(rest.join('='))
         }
      }
      return null
   }


   if(document.cookie){
      let sessionUserCookie=parseCookie("username");
      let sessionIdCookie=parseCookie("sessionId")
      let sessionUser=JSON.parse(sessionUserCookie);
      let sessionId=JSON.parse(sessionIdCookie);
      user=sessionUser;
      sessionId=sessionId
   }else{
      alert('no user detected')
      return
   }



    let form=document.querySelector("#logout-form");
    let confirmWindow=document.querySelector("#confirm-logout-window");
    let yesBtn=document.querySelector('#confirm-logout-yes');
    let noBtn=document.querySelector('#confirm-logout-no')


     form.classList.add('hidden');
     confirmWindow.classList.remove('hidden');

     const runLogout=()=>{

       
        const options={
         method:"DELETE",
         headers:{
            'Content-Type':'application/json',
         },
         body:JSON.stringify({user:user,sessionId:sessionId})
        }

        const deleteUserSession=async()=>{
            await fetch('http://localhost:8000/sessions',options)
            .then(response=>response.json())
            .then(data=>{
                if(data.status===200){
                  document.cookie="username=; sessionId=; max-age=0"
                  alert(data.msg);
                  window.location.replace("/")
               }
            })

        }

        deleteUserSession()
       
     }



      const closeLogoutWindow=()=>{
         form.classList.remove('hidden');
         confirmWindow.classList.add('hidden')
     }


     yesBtn.addEventListener('click',runLogout);
     noBtn.addEventListener('click',closeLogoutWindow)

}

 document.querySelector("#logout-form").addEventListener('submit',handleLogout)


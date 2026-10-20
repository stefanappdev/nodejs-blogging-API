


function handleLogout(){

    let form=document.querySelector("#logout-form");
    let confirmWindow=document.querySelector("#confirm-logout-window");
    let yesBtn=document.querySelector('#confirm-logout-yes');
    let noBtn=document.querySelector('#confirm-logout-no')

    event.preventDefault()
     form.classList.add('hidden');
     confirmWindow.classList.remove('hidden');

     const runLogout=()=>{
        alert('you are logged out');
        document.cookie="session_id=; max-age=0"
        window.location.replace("/")
     }

      const closeLogoutWindow=()=>{
         form.classList.remove('hidden');
         confirmWindow.classList.add('hidden')
     }


     yesBtn.addEventListener('click',runLogout);
     noBtn.addEventListener('click',closeLogoutWindow)

}




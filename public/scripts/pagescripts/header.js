
let user=""

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
    let sessionCookie=parseCookie("session_id")
    let sessionDetails=JSON.parse(sessionCookie);
    user=sessionDetails.username;
}






function handleDropDownMenuDisplay(){
        let dropdownCloseBtn=document.querySelector("#dropdown-close-btn");

            let dropdown=document.querySelector("#mobile-menu-dropdown");
            let dropdownOpenBtn=document.querySelector("#dropdown-open-btn")

            dropdownCloseBtn.addEventListener('click',()=>{
                            dropdown.classList.add('hidden');
                        })
            dropdownOpenBtn.addEventListener('click',()=>{
                dropdown.classList.remove('hidden');
            })
}


function handleRoutesDisplay(){
    
    
    if(user!==''){

        /*if a user logs in hide all login and signup routes,
         show hidden routes on sign in*/ 


        document.querySelector('#currentUser').textContent=` welcome ${user}`
        document.querySelector(".mobile-signup-link").classList.add('hidden');
        document.querySelector(".desktop-signup-link").classList.add('hidden');
        document.querySelector(".mobile-login-link").classList.add('hidden');
        document.querySelector(".desktop-login-link").classList.add('hidden');
        document.querySelector(".mobile-profile-link").classList.remove('hidden');
        document.querySelector(".desktop-profile-link").classList.remove('hidden');

         document.querySelector(".desktop-profile-link").href=`/users/${user}/profile`
        document.querySelector(".mobile-profile-link").href=`/users/${user}/profile`

    }else if(user===''){
        document.querySelector(".mobile-logout-link").classList.add('hidden');
        document.querySelector(".desktop-logout-link").classList.add('hidden');
        document.querySelector('#currentUser').textContent=` welcome guest`
    }
}


handleRoutesDisplay()

handleDropDownMenuDisplay();
     


 
        


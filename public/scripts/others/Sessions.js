class Sessions{
    constructor(sessionId,username,expiresAt){
        this.sessionId=sessionId
        this.username=username,
        this.expiresAt=expiresAt
    }


    getSessionId(){
        return this.sessionId
    }

    //retreive username of current User
    getUsername(){
        return this.username; 
       }

       //return expire time of session

    getExpiresAt(){
        return this.expiresAt
    }



    isExpired(){
        let expiryDate=this.getExpiresAt();
        let newDate=new Date()
        if(expiryDate<newDate){
            return true
        }else{
            return false
        }
    }
}



export default Sessions;
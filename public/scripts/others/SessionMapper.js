class SessionMapper{
    constructor(sessionsList=[],session=null){
        this.session=session
        this.sessionsList=sessionsList
    }

    addNewSession(){
        this.sessionsList.push(this.session);
    }

    removeSession(sessionId){
        this.sessionsList=this.sessionsList.filter(session=>sessionId!==session.sessionId);
    }


    findSession(sessionId){
        return this.sessionsList.find(session=>session.sessionId===sessionId)
    }
}







export default SessionMapper
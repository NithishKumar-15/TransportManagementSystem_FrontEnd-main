const routeState=[];

const routesDetailsReducer=(state=routeState,action)=>{
    switch(action.type){
        case "addRoute":
            return action.data
        default:
            return state
    }
}

export default routesDetailsReducer;
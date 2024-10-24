const vehicleDetailsState=[];

const vehicleDetailsReducer=(state=vehicleDetailsState,action)=>{
    switch(action.type){
        case "addVehicleDetails":
            return action.data;
        default:
            return state;
    }
}

export default vehicleDetailsReducer;
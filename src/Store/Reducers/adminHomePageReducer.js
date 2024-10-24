
const adminData={
    page:'setVehicleRoute',
    vehicles:[],
    route:[]
}

const adminReducer=(state=adminData, action)=>{
    if(action.type==='AssignVehicleRoute'){
        return {
            ...state,
            page:'setVehicleRoute'
        }
    }else if(action.type==='AddNewUserDriver'){
        return {
            ...state,
            page:'AddNewUserDriver'
        }
    }else if(action.type==='VehicleKilometerDetails'){
        return{
            ...state,
            page:'VehicleKilometerDetails'
        }
    }else{
        return state;
    }
}

export default adminReducer;
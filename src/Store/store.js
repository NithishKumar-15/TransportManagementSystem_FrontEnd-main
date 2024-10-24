import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./Reducers/adminHomePageReducer";
import vehicleDetailsReducer from "./Reducers/vehicleDetailsReducer";
import routesDetailsReducer from "./Reducers/routesDetailReducer";

const store=configureStore({
    reducer:{
        adminReducer,
        vehicleDetailsReducer,
        routesDetailsReducer
    }
})

export default store;
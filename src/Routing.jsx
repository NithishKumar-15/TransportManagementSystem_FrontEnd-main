import {react} from 'react'
import { Login } from './Components/LoginComponent/Login'
import DriverHomePage from './Components/DriversHomePage/DriverHomePage'
import AdminHomePage from './Components/AdminHomePage/AdminHomePage'
import { Provider } from 'react-redux'
import store from './Store/store'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '@fontsource/roboto/400.css';

const Routing=()=>{
    return(
        <>
        <Provider store={store}>
        <BrowserRouter>
        <Routes>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path='/DriveHomePage' element={<DriverHomePage></DriverHomePage>}></Route>
        <Route path='/AdminHomePage' element={<AdminHomePage></AdminHomePage>}></Route>
        </Routes>
        </BrowserRouter>
        </Provider>
        </>
    )
}

export default Routing;
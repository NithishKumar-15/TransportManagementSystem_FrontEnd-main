import { useEffect, useState } from "react";
import style from "./adminHomePage.module.css"
import { useDispatch, useSelector } from "react-redux";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import instance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const AdminHomePage = () => {

    const { page } = useSelector((state) => state.adminReducer);

    const vehicleDetailsReducer = useSelector((state) => state.vehicleDetailsReducer);
    const routesDetailsreducer = useSelector((state) => state.routesDetailsReducer);

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const vehicle = useRef();
    const route = useRef();

    useEffect(() => {
        async function getVehcileAndRouteDetails() {

            /*-----------------Get vehicle Details code start ------------------*/
            const responseGetVehicle = await instance.get("/GetVehicleDetails", {
                headers: {
                    token: localStorage.getItem("token"),
                }
            });
            //If response unAuthorized navigate to login
            if (responseGetVehicle.data.message === "UnAuthorized") {
                navigate("/")
            }
            //Else Dispatch the response data to the store 
            else {
                dispatch({ type: "addVehicleDetails", data: responseGetVehicle.data.vehicleDetails })
            }
            /*-----------------Get vehicle Details code End ------------------*/



            /*-----------------Get Route Details code start ------------------*/
            const responseGetRoutes = await instance.get("/GetVehicleRoute", {
                headers: {
                    token: localStorage.getItem("token")
                }
            })
            //If response unAuthorized navigate to login
            if (responseGetRoutes.data.message === "UnAuthorized") {
                navigate("/")
            }
            //Else Dispatch the response data to the store 
            else {
                dispatch({ type: "addRoute", data: responseGetRoutes.data.vehicleRouteDetails })
            }
            /*-----------------Get Route Details code End ------------------*/
        }


        getVehcileAndRouteDetails();
    }, [])

    const [vehicleKilometer, setVehicleKilometer] = useState([]);

    //error Message state to handel the form input values
    const [errorMessage, setErrorMessage] = useState();

    const [userName, setUserName] = useState("");
    const [driverEmail, setDriverEmail] = useState("");
    const [driverPassword, setDriverPassword] = useState("");

    /*-----------------Function starts --------------------*/

    //Add new user Driver Function
    const addUserDriver = async () => {
        try {
            if (driverEmail != "" && driverPassword != "" && userName != "") {
                const data = {
                    userName: userName,
                    email: driverEmail,
                    password: driverPassword
                }
                const response = await instance.post("/AddUserDriver", data);
                if (response.data.message === "Data Added successfully") {
                    setErrorMessage("Data Added Successfully")
                }
            } else {
                setErrorMessage("All Fields Required")
            }
        } catch (e) {
            console.log(e)
        }
    }

    //Assigne Routefor vehicle function
    const assigneVehicleRoute = async () => {

        // vehicle ref and route ref should not empty
        if (vehicle.current.value != "" && route.current.value != "") {
            const data = {
                vehcile: vehicle.current.value,
                route: route.current.value
            }

            const response = await instance.put("/AssigneRouteVehicle", data, {
                headers: {
                    token: localStorage.getItem("token"),
                }
            });
            if (response.data.message === "data updated sucess") {
                setErrorMessage("dataUpdatedSuccess");
            } else if (response.data.message === "UnAuthorized") {
                navigate("/");
            }
        } else {
            setErrorMessage("selectvehicleOrRoute");
        }
    }

    /*-----------------Function Ends --------------------*/

    return (
        <>
            <div className={`${style.adminHomePage} container-fluid d-flex flex-column`}>
                <div className="d-flex justify-content-between p-3">
                    <h4>User Name: Kumar</h4>
                    <h4>User: Admin</h4>
                </div>

                <div className="w-50 mx-auto">
                    <div className="row w-100">
                        <a className="col-lg btn btn-primary" onClick={() => {
                            if (errorMessage != "") {
                                setErrorMessage("");
                            } dispatch({ type: 'AssignVehicleRoute' })
                        }}>Assign vehicle route</a>
                        <a className="col-lg btn btn-danger" onClick={() => {
                            if (errorMessage != "") {
                                setErrorMessage("");
                            }
                            dispatch({ type: 'AddNewUserDriver' })
                        }}>Add New user Driver</a>
                        <a className="col-lg btn btn-success" onClick={() => {
                            if (errorMessage != "") {
                                setErrorMessage("");
                            }
                            dispatch({ type: 'VehicleKilometerDetails' })
                        }}>Vehicle Kilometer Details</a>
                    </div>
                </div>

                {
                    page === 'setVehicleRoute' &&
                    <>
                        <div className={`w-50 h-50 bg-white m-auto rounded d-flex flex-column`}>
                            <h4 className="text-center">MS Travels</h4>

                            <div className={`w-50 h-50 m-auto`}>
                                <h5 className="text-center mb-3">Assigne Route To A vehicle</h5>

                                <select className="form-select form-select-lg mb-3" aria-label="Large select example" ref={vehicle}>
                                    <option value={''}>Select The vehicle</option>
                                    {
                                        vehicleDetailsReducer.length > 0 && <>{vehicleDetailsReducer.map((val) => (<option value={val.VehicleNumber} key={val.VehicleNumber}>{val.VehicleNumber}</option>))}</>
                                    }
                                </select>

                                <select className="form-select form-select-lg mb-3" aria-label="Large select example" ref={route}>
                                    <option value={''}>Select The Route</option>
                                    {
                                        routesDetailsreducer.length > 0 && <>
                                            {routesDetailsreducer.map((val) => (<option value={val.RouteName} key={val.RouteName}>{val.RouteName}</option>))}
                                        </>
                                    }
                                </select>

                                <button className="btn btn-primary d-block mx-auto mb-2" onClick={assigneVehicleRoute}>Submit</button>
                                {errorMessage === "selectvehicleOrRoute" && <label className="text-center d-block text-danger">Please select the route and vehicle</label>}
                                {errorMessage === "dataUpdatedSuccess" && <label className="text-center d-block text-success">Data Updated Success</label>}
                            </div>
                        </div>
                    </>
                }

                {
                    page === 'AddNewUserDriver' &&
                    <>
                        <div className={`w-50 h-50 bg-white m-auto rounded d-flex flex-column`}>
                            <div className="w-50 h-50 m-auto">
                                <h5 className="text-center mb-3">Add User Driver</h5>
                                <TextField id="outlined-basic" label="User Name" variant="outlined" sx={{ width: "100%", marginBottom: "10px" }} size="small" type={"text"} onChange={(e) => setUserName(e.target.value)} />
                                <TextField id="outlined-basic" label="Driver Email" variant="outlined" sx={{ width: "100%", marginBottom: "10px" }} size="small" type={"email"} onChange={(e) => setDriverEmail(e.target.value)} />
                                <TextField id="outlined-basic" label="Driver Password" variant="outlined" sx={{ width: "100%", marginBottom: "10px" }} size="small" type={"email"} onChange={(e) => setDriverPassword(e.target.value)} />
                                <Button variant="contained" className=" d-block mx-auto mb-2" onClick={addUserDriver}>Submit</Button>
                                {errorMessage === "All Fields Required" && <label className="d-block text-center text-danger">Please Enter All the required fields</label>}
                                {errorMessage === "Data Added Successfully" && <label className="d-block text-center text-success">Data Added Successfully</label>}
                            </div>
                        </div>
                    </>
                }

                {
                    page === 'VehicleKilometerDetails' &&
                    <>
                        <div className="w-25 mx-auto mt-4">
                            <select className="form-select form-select-lg mb-3" aria-label="Large select example" onChange={(e) => {
                                vehicleDetailsReducer.forEach((val) => {
                                    if (val.VehicleNumber === e.target.value) {
                                        setVehicleKilometer([...val.KilometerDriven]);
                                    }
                                })
                            }}>
                                <option value={''}>Select the vehicle</option>
                                {
                                    vehicleDetailsReducer.length > 0 && <>{vehicleDetailsReducer.map((val) => (<option value={val.VehicleNumber} key={val.VehicleNumber}>{val.VehicleNumber}</option>))}</>
                                }
                            </select>
                        </div>
                        <div className="w-50 m-auto">
                            {vehicleKilometer.length > 0 && <>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Starting Kilometer</th>
                                            <th>Ending Kilometer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehicleKilometer.map((val) => (<>
                                            <tr key={val.Date}>
                                                <th>{Date(val.Date)}</th>
                                                <th>{val.StartingKilometer}</th>
                                                <th>{val.EndingKilometer}</th>
                                            </tr>
                                        </>))}
                                    </tbody>
                                </table>
                            </>}
                        </div>
                    </>
                }

            </div>
        </>
    )
}

export default AdminHomePage;
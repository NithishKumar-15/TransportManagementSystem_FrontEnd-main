import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import style from "./driverHomePage.module.css"
import instance from "../../axiosInstance";
import { useRef } from "react";
const DriverHomePage = () => {

    const [formName, setFormName] = useState('Vehicle');

    const vehicleDetailsReducer = useSelector((state) => state.vehicleDetailsReducer);
    const routesDetailsreducer = useSelector((state) => state.routesDetailsReducer);

    const [errorMessage, setErrorMessage] = useState();

    const dispatch = useDispatch()
    const navigate = useNavigate();

    //Kilometer details data state
    const [vehicle, setVehicle] = useState("");
    const [route, setRoute] = useState("");
    const [date, setDate] = useState("");
    const [startingKilometer, setStartingKilometer] = useState("");
    const [endingKilometer, setEndingKilometer] = useState("");

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


    //Add kilometer details to vehicle function
    async function submitForm(e) {
        e.preventDefault();
        if (errorMessage != "") {
            setErrorMessage("");
        }


        if (formName === 'Vehicle' && (vehicle != "" || route != "")) {
            setFormName('Date')
        } else if (formName === 'Date' && date != "") {
            setFormName('Kilometer')
        } else if (formName === 'Kilometer' && startingKilometer != "" && endingKilometer != "") {
            const data = {
                vehicleNumber: vehicle,
                route: route,
                date: date,
                startingKilometer: startingKilometer,
                endingKilometer: endingKilometer
            }

            const response = await instance.put("/AddKilometerVehicle", data, {
                headers: {
                    token: localStorage.getItem("token")
                }
            });

            setFormName('Vehicle')
        } else {
            setErrorMessage('fieldsRequired')
        }

    }

    return (
        <>
            <div className={`${style.driverhomepage} container-fluid d-flex flex-column`}>
                <div className="d-flex justify-content-between p-3">
                    <h4>User Name: Nithish</h4>
                    <h4>User: Driver</h4>
                </div>

                <div className={`${style.driverform} bg-white m-auto d-flex flex-column rounded`}>
                    <h4 className="text-center">MS Travels</h4>
                    <div className="w-75 h-50 m-auto">
                        <form onSubmit={submitForm}>
                            {formName === 'Vehicle' && <>
                                <h5 className="text-center mb-2">Select Vehicle or Route Your Going to drive</h5>
                                <select className="form-select mb-3" aria-label="Default select example" onChange={(e) => setVehicle(e.target.value)}>
                                    <option value={""}>Select The Vehicle</option>
                                    {
                                        vehicleDetailsReducer.length > 0 && <>{vehicleDetailsReducer.map((val) => (<option value={val.VehicleNumber} key={val.VehicleNumber}>{val.VehicleNumber}</option>))}</>
                                    }
                                </select>
                                <h6 className="text-center fs-4">or</h6>
                                <select className="form-select mb-3" aria-label="Default select example" onChange={(e) => setRoute(e.target.value)}>
                                    <option value={""}>Select The Route</option>
                                    {
                                        routesDetailsreducer.length > 0 && <>
                                            {routesDetailsreducer.map((val) => (<option value={val.RouteName} key={val.RouteName}>{val.RouteName}</option>))}
                                        </>
                                    }
                                </select>
                            </>}

                            {
                                formName === 'Date' &&
                                <><h5 className="text-center mb-2">Select The Date</h5>
                                    <input type="date" className="form-control mb-3" onChange={(e) => setDate(e.target.value)}></input>
                                </>
                            }

                            {
                                formName === 'Kilometer' &&
                                <>
                                    <h5 className="text-center mb-2">Starting kilometer and ending kilometer</h5>
                                    <input type="number" className="form-control mb-3" placeholder="Starting kilometer" onChange={(e) => setStartingKilometer(e.target.value)}></input>
                                    <h6 className="text-center fs-4">And</h6>
                                    <input type="number" className="form-control mb-3" placeholder="Ending kilometer" onChange={(e) => setEndingKilometer(e.target.value)}></input>
                                </>
                            }
                            {errorMessage === "fieldsRequired" && <label className="d-block text-center text-danger">please Select the required fields</label>}

                            <button className="btn btn-primary d-block mx-auto">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DriverHomePage;
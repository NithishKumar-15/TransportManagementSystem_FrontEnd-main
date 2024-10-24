import { useEffect, useRef, useState } from "react";
import style from "./login.module.css";
import instance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";

//MUI Components
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


const Login = () => {
    const [toggle, setToggle] = useState("Admin");
    const [message, setMessage] = useState("");

  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
    }, [])

    //Login function
    const LoginFrom = async (e) => {
        try {
           
            if (email != "" && password != "") {
                setMessage("");
                const data = {
                    email: email,
                    password: password,
                    role: toggle
                }

                const respons = await instance.post("/Login", data);
              
                if (respons.data.message === "Login Successful") {

                    localStorage.setItem("token", respons.data.token);
                    localStorage.setItem("userName", respons.data.payLoadData.UserName);
                    localStorage.setItem("role", respons.data.payLoadData.Role)

                    if (respons.data.payLoadData.Role === "Admin") {
                        navigate("/AdminHomePage");
                    } else if (respons.data.payLoadData.Role === "Driver") {
                        navigate("/DriveHomePage");
                    }

                } else if (respons.data.message === "User Not Found") {
                    setMessage(respons.data.message + " Please check User Name and password");
                }

            } else {
                setMessage("Please Enter the all required details");
            }

        } catch (e) {
            console.log(e);
        }

    }

    return (
        <>
            <div className={`${style.loginpage} container-fluid d-flex flex-column`}>

                {toggle === "Driver" &&
                    <>
                        <FormControlLabel control={<Switch defaultChecked />} label={`${toggle} Login`} onClick={() => setToggle("Admin")} />
                    </>
                }

                {
                    toggle === "Admin" &&
                    <>
                        <FormControlLabel control={<Switch />} label={`${toggle} Login`} onClick={() => setToggle("Driver")} />
                    </>
                }

                <div className={`${style.backgroundimage} m-auto d-flex flex-column container`}>
                    <div className={`w-25 h-57 m-auto bg-white p-4 border rounded`}>
                        <form onSubmit={LoginFrom}>
                            <h5 className='text-center'>User Login</h5>
                            <TextField id="outlined-basic" label="Email" variant="outlined" sx={{ width: "100%", marginBottom: "10px" }} size="small" type={"email"} onChange={(e) => setEmail(e.target.value)} />

                            <TextField id="outlined-basic" label="Password" variant="outlined" sx={{ width: "100%", marginBottom: "10px" }} size="small" type={"password"} onChange={(e)=>setPassword(e.target.value)}/>

                            {toggle === "Driver" && <Button variant="contained" className="mx-auto d-block" onClick={LoginFrom}>Driver Login</Button>}
                            {toggle === "Admin" && <Button variant="contained" className="mx-auto d-block" onClick={LoginFrom}>Admin Login</Button>}

                            {message != "" && <label className="d-block mt-2 text-center text-danger" style={{ fontSize: "12px" }}>{message}</label>}
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export { Login };
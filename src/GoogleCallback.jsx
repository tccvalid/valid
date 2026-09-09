import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


function GoogleCallback(){

    const navigate = useNavigate();


    useEffect(() => {

        const params = new URLSearchParams(
            window.location.search
        );


        const token = params.get("token");


        if(token){

            localStorage.setItem(
                "token",
                token
            );


            navigate("/");

        }

    }, []);


    return (
        <h1>
            Entrando com Google...
        </h1>
    );
}


export default GoogleCallback;
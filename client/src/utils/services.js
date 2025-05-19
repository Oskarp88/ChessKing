import axios from "axios";

// export const baseUrl = 'https://chessknigth-22fe0ebf751e.herokuapp.com/api';
 export const baseUrl = import.meta.env.VITE_PRODUCTION === 'production'
                            ? 'https://chessknigth-22fe0ebf751e.herokuapp.com/api'
                            : 'http://localhost:8080/api'

export const postRequest = async(url, body) => {
   const response = await fetch(url, {
    method: "POST",
    headers: {
        "content-type": "application/json",
    },
    body,

   });

   const data = await response.json();

   if(!response.ok){
    let message;
    if(data?.message){
        message = data.message;
    }else{
        message = data;
    }

    return {error: true, message};
   }

   return data;
}
export const getRequest = async(url) => {
    const response = await fetch(url);

    const data = await response.json();

    if(!response.ok){
        let message = "An error occured..."
        if(data?.message){
            message = data.message;
        }

        return {error: true, message}
    }
   return data;
}

export const putRequest = async(url, body) => {

    const response = await axios.put(url, {body});
 
    if(!response.ok){
     let message;
     if(response?.message){
         message = response.message;
     }else{
         message = response;
     }
 
     return {error: true, message};
    }
 
    return response;
 }
import { useEffect, useState } from "react"
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipient = (chat, user) =>{
    const [recipientUser, setRecipientUser] = useState(null);
    // const [setError] = useState(null);

    const recipientId = chat?.members?.find((id) => id !== user?._id );
    
    useEffect(() => {
        const getUser = async()=>{
           if(!recipientId) return null;

           const response = await getRequest(`${baseUrl}/user/${recipientId}`);

           if(response.error){
              console(response.error);
              return;
           }

           setRecipientUser(response);
        }
        getUser();
    },[recipientId]);

    return {recipientUser}
}
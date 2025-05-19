import { useContext, useEffect, useState } from "react"
import { ChatContext } from "../context/chatContext/ChatContext"
import { baseUrl, getRequest } from "../utils/services";

export const useFetchLatesMessage = (chat) => {
    const {newMessage, notifications} = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);

    useEffect(() => {
        const getMessage = async () => {
            const response = await getRequest(`${baseUrl}/messages/${chat?._id}`)
            
            if(response?.error){
                return console.log('Error gettin messages...', response.error);
            }

            const lastMessage = response[response?.length - 1];

            setLatestMessage(lastMessage);
        };

        getMessage();
    }, [newMessage, notifications, chat?._id]);

    return {latestMessage};
}

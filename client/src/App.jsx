import "./App.css";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'normalize.css';
import 'animate.css';
// import { useAuth } from "./context/authContext/authContext";
// import { SocketProvider } from "./context/socketContext/SocketProvider";
// import { ChatContextProvider } from "./context/chatContext/ChatContextProvider";
// import { PieceProvider } from "./context/pieceContext/PieceProvider";
// import { LanguagesProvider } from "./context/languagesContext/LanguagesProvider";
// import { CheckMateProvider } from "./context/checkMateContext/CheckMateProvider";
// import { GameContextProvider } from "./context/gameContext/GameContextProvider";
// import { ModalProvider } from "./context/modalContext/ModalProvider";
import NavBar from "./components/navbar/NavBar";
// import Sidebar from "./components/navbar/sidebar";
import  Home  from "./pages/home/Home";
import NotFound from "./pages/PageNotFound";
// import PageLoading from "./components/loading/PageLoading";
// import Login from "./pages/Login";
// import ForgotPassword from "./pages/ForgotPassewor";
// import ResetPassword from "./pages/ResetPassword";
// import GameTimes from "./components/chessBoard/page/gameTimes";
// import Chessboard from "./components/Chessboard";
// import ChessBoardMain from "./components/chessBoard/page/ChessBoardMain";
// import PrivateRoute from "./components/routes/PrivateRoute";
// import Register from "./pages/user/Register";
// import Chats from "./pages/Chats";
// import Channel from "./components/channel/Channel";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "./context/modalContext/ModalProvider";
import Login from "./pages/Login";
import { LanguagesProvider } from "./context/languagesContext/LanguagesProvider";
import { CheckMateProvider } from "./context/checkMateContext/CheckMateProvider";
import { ChessboardProvider } from "./context/boardContext/ChessboardProvider";
import { GameContextProvider } from "./context/gameContext/GameContextProvider";
import { useAuth } from "./context/authContext/authContext";
import Registro from "./pages/Registro";
// import Registro from "./pages/Registro";
// import UserProfile from "./pages/user/UserProfile";

function App() {
   const {auth} = useAuth();
 
  return (
    
  // <SocketProvider user={auth.user}>
  //  <ChatContextProvider user={auth.user}>
  //    <PieceProvider>
       <LanguagesProvider>
       {/* <CheckMateProvider> */}
         <ChessboardProvider user={auth.user}>  
            {/* <GameContextProvider user={auth.user}>       */}
                <Router>
                <ModalProvider>
                  <div id="app">
                    <NavBar />
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Registro />} />
                      <Route path="*" element={<NotFound />} />
                      {/* otras rutas */}
                    </Routes>
                    <Toaster />
                  </div>
                </ModalProvider>
                </Router>

            {/* </GameContextProvider> */}
         </ChessboardProvider>
        {/* </CheckMateProvider> */}
        </LanguagesProvider>
  //   </PieceProvider>
  //  </ChatContextProvider>
  //  </SocketProvider>
   
  );
}

export default App;
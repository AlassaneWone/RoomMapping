import './styles/App.css';
import {
    Routes,
    Route,
} from "react-router-dom";
import MapList from "./pages/MapList";
import Home from "./pages/Home";
import Nav from "./pages/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyAccount from "./pages/MyAccount";
import Games from "./pages/Games";
import NewGame from "./pages/NewGame";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Nav/>}>
                <Route index element={<Home/>}/>
                <Route path="/maplist" element={<MapList/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/myaccount" element={<MyAccount/>}/>
                <Route path="/games" element={<Games/>}/>
                <Route path="/newgame" element={<NewGame/>}/>
            </Route>
        </Routes>
    );
}

export default App;
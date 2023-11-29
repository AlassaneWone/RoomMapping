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
import Zoomzoom from "./pages/Zoomzoom";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Nav/>}>
                <Route index element={<Home/>}/>
                <Route path="/maplist" element={<MapList/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/myaccount" element={<MyAccount/>}/>
            </Route>
            <Route path="/zoom" element={<Zoomzoom/>}/>
        </Routes>
    );
}

export default App;
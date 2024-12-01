import React from "react"
import { BrowserRouter as Router, Route, Routes, Outlet, useLocation } from 'react-router-dom'; 
import './App.css';
import Iniciar from "./pages/login.jsx"; 
import Sucursales from './pages/Data/DataSucursales.jsx' 
import Aplicaciones from './pages/Data/DataAplicaciones.jsx' 
import Mantenimientos from "./pages/Data/DataMantenimientos.jsx";
import AppInfo from './pages/Informes/App_Infor.jsx' 
import DeviceInfo from './pages/Informes/Device_Infor.jsx' 
import ManteInfo from "./pages/Informes/Mante_Infor.jsx";
import ManualInfo from "./pages/Informes/Manual_Infor.jsx";
import NotFoundPage from "./pages/NotFound.jsx"; 
import PanUsers from './pages/Panels/PanelUsers.jsx' 
import PanSucursal from './pages/Panels/PanelSucursal.jsx' 
import PanelApp from './pages/Panels/PanelApp.jsx' 
import PanMantenimientos from "./pages/Panels/PanelMantenimiento.jsx";
import PanManuales from "./pages/Panels/PanelManual.jsx";
import Navbar from './components/Elements/Navbar.jsx' 
import { UserProvider } from './context/UserContext.jsx'; 

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/" element={<Iniciar />} />
                        <Route path="/status" element={<AppInfo />} />
                        <Route path="/devices" element={<DeviceInfo />} />
                        <Route path="/mantes" element={<ManteInfo />} />
                        <Route path="/manual" element={<ManualInfo />} />
                        <Route path="/sucursales" element={<Sucursales />} />
                        <Route path="/aplicaciones" element={<Aplicaciones />} />
                        <Route path="/mantenimientos" element={<Mantenimientos />} />
                        <Route path="/pansucursal" element={<PanSucursal />} />
                        <Route path="/panusers" element={<PanUsers />} />
                        <Route path="/panapps" element={<PanelApp />} />
                        <Route path="/panmantenimiento" element={<PanMantenimientos />} />
                        <Route path="/panmanuales" element={<PanManuales />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Router>
        </UserProvider>
    );
}

function Layout() {
    const location = useLocation();
    const noNavbarPaths = ['/']; 

    return (
        <>
            {!noNavbarPaths.includes(location.pathname) && <Navbar />}
            <div className="fondo">
                <Outlet />
            </div>
        </>
    );
}


export default App
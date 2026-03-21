import {Routes, Route} from "react-router"
import Dashboard from "./pages/dashboard.jsx"
import AIchat from "./pages/aiChat.jsx"
import History from "./pages/history.jsx"
import CamStream from "./pages/camStream.jsx"
import Login from "./auth/login.jsx"
import SignUp from "./auth/signup.jsx"
import Settings from "./pages/settings.jsx"
import Notifications from "./pages/notifications.jsx"



function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/chat" element={<AIchat/>} />
        <Route path="/history" element={<History/>} />
        <Route path="/stream" element={<CamStream/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/notifications" element={<Notifications/>} />


      </Routes>
    </div>
  );
}

export default App;

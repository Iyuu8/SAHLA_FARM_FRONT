import {Routes, Route} from "react-router"
import Dashboard from "./pages/dashboard.jsx"
import AIchat from "./pages/aiChat.jsx"
import History from "./pages/history.jsx"
import CamStream from "./pages/camStream.jsx"
import Login from "./auth/login.jsx"
import SignUp from "./auth/SignUp.jsx"
import Settings from "./pages/settings.jsx"
import Notifications from "./pages/notifications.jsx"
import Layout from "./layout.jsx"
function App() {
  return (
    <>
      <Routes>

        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />

        <Route path="/" element={<Layout/>}>

          <Route index element={<Dashboard/>} />
          <Route path="/history" element={<History/>} />
          <Route path="/stream" element={<CamStream/>} />
          <Route path="/chat" element={<AIchat/>} />
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/settings" element={<Settings/>} />

        </Route>

      </Routes>
    </>
  );
}

export default App;
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import WardenLogin from './pages/WardenLogin';
import UserHome from './pages/UserHome';
import WardenHome from './pages/WardenHome';
import HostelManagement from './pages/HostelManagement';
import AddRoom from './pages/AddRoom';
import EditRoom from './pages/EditRoom';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/userHome" element={<UserHome />} />

        <Route path="/wardenLogin" element={<WardenLogin />} />
        <Route path="/wardenHome" element={<WardenHome />} />
        <Route path="/hostelManagement/:wardenID" element={<HostelManagement />} />
        <Route path="/addRoom/:hostelID" element={<AddRoom />} />
        <Route path='/editRoom/:roomID' element={<EditRoom />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

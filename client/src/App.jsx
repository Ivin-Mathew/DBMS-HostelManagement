import {BrowserRouter, Routes, Route} from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import WardenLogin from './pages/WardenLogin';
import UserHome from './pages/UserHome';
import WardenHome from './pages/WardenHome';
import HostelManagement from './pages/HostelManagement';
import AddRoom from './pages/AddRoom';
import EditRoom from './pages/EditRoom';
import HostelSearch from './pages/HostelSearch';
import HostelDetails from './pages/HostelDetails';
import ViewInmates from './pages/ViewInmates';
import UserHostelDetails from './pages/UserHostelDetails';
import SplashScreen from './pages/splashscreen';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/userHome" element={<UserHome />} />
        <Route path="/search" element={<HostelSearch />} />
        <Route path="/hostelDetails/:hostelid" element={<HostelDetails />} />

        <Route path="/wardenLogin" element={<WardenLogin />} />
        <Route path="/wardenHome" element={<WardenHome />} />
        <Route path="/hostelManagement/:wardenID" element={<HostelManagement />} />
        <Route path="/addRoom/:hostelID" element={<AddRoom />} />
        <Route path='/editRoom/:roomID' element={<EditRoom />} />
        <Route path='/viewInmates' element={<ViewInmates />} />
        <Route path="/userHostelDetails" element={<UserHostelDetails />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

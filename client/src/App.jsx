import {BrowserRouter, Routes, Route} from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import WardenLogin from './pages/WardenLogin';
import UserHome from './pages/UserHome';
import WardenHome from './pages/WardenHome';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/userHome" element={<UserHome />} />
        <Route path="/" element={<UserLogin />} />
        <Route path="/wardenLogin" element={<WardenLogin />} />
        <Route path="/wardenHome" element={<WardenHome />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import WardenLogin from './pages/WardenLogin';
import UserHome from './pages/UserHome';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/userHome" element={<UserHome />} />
        <Route path="/" element={<UserLogin />} />
        <Route path="/wardenLogin" element={<WardenLogin />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

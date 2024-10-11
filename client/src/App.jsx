import {BrowserRouter, Routes, Route} from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import WardenLogin from './pages/WardenLogin';



function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/wardenLogin" element={<WardenLogin />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;

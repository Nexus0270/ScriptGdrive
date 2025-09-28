import { Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './unAuth/LandingPage';
import SettingsPage from './unAuth/SettingsPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;

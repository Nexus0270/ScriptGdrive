import { Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './unAuth/LandingPage';
import SettingsPage from './unAuth/SettingsPage';
import { FileProvider } from './contexts/FileContext';

function App() {
  return (
    <FileProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </FileProvider>
  );
}

export default App;

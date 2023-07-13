import './App.css';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import UploadImageToS3WithNativeSdk from './components/UploadImageToS3WithNativeSdk';
import TableComponent from './components/newpage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
            <Route path="/" element={<UploadImageToS3WithNativeSdk />} />
            <Route path="newpage" element={<TableComponent />} />
        </Routes>
    </Router>
    </div>
    
  );
}

export default App;
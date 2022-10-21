
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AddEditUser from './user/components/AddEditUser';
import UsersList from './user/components/UsersList';
import AppHeader from './AppHeader';

function App() {
  return (
    <div className="app-main">
      <Router>
      <AppHeader />
        <Routes>
          <Route path="/" element={<Navigate to="/user/add" replace />} />
          <Route path="/user/add" element={<AddEditUser />} />
          <Route path="/user/edit/:userId" element={<AddEditUser />} />
          <Route path="/users" element={<UsersList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

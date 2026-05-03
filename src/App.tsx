import { Link, Outlet } from 'react-router-dom';
import './App.css';
import ChatBot from './components/chatbot/ChatBot';
import Footer from './components/footer/Footer';

function App() {

  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/upload">Upload</Link></li>
          <li><Link to="/policies">Policies</Link></li>
        </ul>
      </nav>
      <div className="content">
        <h1>Welcome to the Dashboard</h1>
        <p>This is the main dashboard of the application.</p>
        <Outlet />
      </div>
      <ChatBot />
      <Footer />
    </>
  );
}

export default App;

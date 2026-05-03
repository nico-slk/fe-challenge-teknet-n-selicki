import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Policies from './pages/Policies';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "upload",
        element: <Upload />,
      },
      {
        path: "policies",
        element: <Policies />,
      },
    ],
  },
]);

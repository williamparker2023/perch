import { RouterProvider } from 'react-router';
import { router } from './routes';
import './app.css';

export default function App() {
  return <RouterProvider router={router} />;
}

import './App.css'
import AppRouter from './routes/AppRoute';
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import UserLayouts from './layouts/User/UserLayouts';

function App() {

  return (
    <div>
        <AppRouter></AppRouter>
    </div>
  )
}

export default App

import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Feature from './components/Feature';

function App() {
    return (
        <div>
            <Header />
            <Routes>
                <Route exact path="/" element={<Welcome />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/feature" element={<Feature />} />
            </Routes>
        </div>
    );
}

export default App;

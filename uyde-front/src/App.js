import SignUp from './components/SignUp';
import Login from './components/Login';
import OwnerPost from './components/OwnerPost';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from './components/Navbar'; // если в этом месте

function App() {
    return (
        <div className="App">
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/owner-post" element={<OwnerPost/>}/>
                </Routes>
            </Router>
        </div>
    )

}

export default App;

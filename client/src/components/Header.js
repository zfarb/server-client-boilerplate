import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signout } from '../store';

function Header() {
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleSignout = () => {
        dispatch(signout());
    };

    return (
        <div className="flex items-center">
            <Link to="/">Home</Link>
            {!token ? (
                <div>
                    <Link to="/signup">Sign Up</Link>
                    <Link to="/signin">Sign In</Link>
                </div>
            ) : (
                <Link to="/" onClick={handleSignout}>
                    Sign Out
                </Link>
            )}
            <Link to="/feature">Feature</Link>
        </div>
    );
}

export default Header;

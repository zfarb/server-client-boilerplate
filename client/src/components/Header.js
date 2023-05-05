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
        <div>
            <Link to="/">Home</Link>
            <Link to="/signup">Sign Up</Link>
            {!token ? (
                <Link to="/signin">Sign In</Link>
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

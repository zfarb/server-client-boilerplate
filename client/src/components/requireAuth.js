import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const requireAuth = (ChildComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate();
        const { token } = useSelector((state) => state.auth);

        useEffect(() => {
            if (!token) {
                navigate('/');
            }
        }, [token, navigate]);

        return <ChildComponent {...props} />;
    };

    return AuthComponent;
};

export default requireAuth;

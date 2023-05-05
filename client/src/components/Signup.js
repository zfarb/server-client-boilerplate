import { reduxForm, Field } from 'redux-form';
import { useSignupMutation } from '../store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Signup(props) {
    const { handleSubmit } = props;
    const [signup, { isSuccess }] = useSignupMutation();
    const { auth } = useSelector((state) => state);
    const navigate = useNavigate();

    const onFormSubmit = (formProps) => {
        signup(formProps);
    };

    useEffect(() => {
        if (isSuccess) {
            navigate('/feature');
        }
    }, [isSuccess, navigate]);

    return (
        <form onSubmit={handleSubmit(onFormSubmit)}>
            <fieldset>
                <label>Email: </label>
                <Field
                    name="email"
                    type="text"
                    component="input"
                    autoComplete="none"
                />
                {auth.error && ' ' + auth.error}
            </fieldset>
            <fieldset>
                <label>Password: </label>
                <Field
                    name="password"
                    type="password"
                    component="input"
                    autoComplete="none"
                />
            </fieldset>
            <button>Sign Up</button>
        </form>
    );
}

export default reduxForm({ form: 'signup' })(Signup);

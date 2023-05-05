import { reduxForm, Field } from 'redux-form';
import { useSigninMutation } from '../store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Signin(props) {
    const { handleSubmit } = props;
    const [signin, { isSuccess }] = useSigninMutation();
    const { auth } = useSelector((state) => state);
    const navigate = useNavigate();

    const onFormSubmit = (formProps) => {
        signin(formProps);
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
            {auth.error && ' ' + auth.error}
            <button>Sign In</button>
        </form>
    );
}

export default reduxForm({ form: 'signin' })(Signin);

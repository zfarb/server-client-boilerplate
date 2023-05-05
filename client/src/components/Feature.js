import requireAuth from './requireAuth';

function Feature() {
    return <div>Feature</div>;
}

export default requireAuth(Feature);

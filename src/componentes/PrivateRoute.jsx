import { Navigate, Outlet } from 'react-router-dom';
import { getUserRoles } from '../util/GetUserRoles';
import { useAppContext } from '../context/AppContext';
import { useEffect, useState } from 'react';

const PrivateRoute = ({ permissao }) => {
    const { setUser, setToken } = useAppContext();
    const [redirect, setRedirect] = useState(false);

    const role = getUserRoles();
    const rolePermitida = Array.isArray(permissao) ? permissao : [permissao];

    useEffect(() => {
        if (!rolePermitida.includes(role)) {
            setUser(null);
            setToken(null);
            setRedirect(true);
        }
    }, [role, rolePermitida, setUser, setToken]);

    if (!role) return <Navigate to="/login" replace />;

    if (redirect) return <Navigate to="/login" replace />;

    return <Outlet />;
};

export default PrivateRoute;
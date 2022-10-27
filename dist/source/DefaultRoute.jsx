import { Route } from './Route.js';
import { Navigate } from "./Navigate.js";
export const DefaultRoute = ({ to = '', fallback = false }) => (<Route path={`/*`} fallback={fallback}>
    <Navigate to={to}/>
  </Route>);

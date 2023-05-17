import { Route } from './Route.js';
import { Navigate } from "./Navigate.js";
export function DefaultRoute({ to = '', fallback = false }) {
    return (<Route path={`/*`} fallback={fallback}>
      <Navigate to={to}/>
    </Route>);
}

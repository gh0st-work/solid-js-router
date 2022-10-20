import {Route} from './Route'
import {Navigate} from "./Navigate";


export const DefaultRoute = ({to = '', fallback = false}) => (
  <Route path={`/*`} fallback={fallback}>
    <Navigate to={to}/>
  </Route>
)
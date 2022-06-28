import {Route} from './Route'
import {Navigate} from "./Navigate";


export const DefaultRoute = ({to = ''}) => (
  <Route path={'/*'}>
    <Navigate to={to}/>
  </Route>
)
import {Route} from './Route.js'
import {Navigate} from "./Navigate.js";
import {JSX} from "solid-js/types/jsx";


export function DefaultRoute({
  to = '',
  fallback = false
} : {
  to: string,
  fallback?: boolean,
}): JSX.Element {
  return (
    <Route path={`/*`} fallback={fallback}>
      <Navigate to={to}/>
    </Route>
  )
}
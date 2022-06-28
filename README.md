# solid-js-router
**React-like [solid.js](https://solidjs.com) browser router with hassle-free inheritance / dynamic routes**

[Github](https://github.com/gh0st-work/solid-js-router)

## Motivation
Solid.js default [**solid-app-router** package](https://github.com/solidjs/solid-app-router) does not support convenient work with route inheritance / dynamic routes. Docs says, it only supports `<Outlet/>` rendering, i.e.:
```jsx
<Route path='/' element={<div>Onion starts here <Outlet /></div>}>
  <Route path='layer1' element={<div>Another layer <Outlet /></div>}>
    <Route path='layer2' element={<div>Innermost layer</div>}></Route>
  </Route>
</Route>
```

So, as you can see, it's not really convenient and component/reactive way. And I've decided to write a better lib, i.e.:
```jsx
<Routes>
  <Route path={'/'}>
    <div>Onion starts here <Onion /></div>
  </Route>  
</Routes>

// for /*
const Onion = () => (
  <Routes>
    <Route path={'layer1'}>
      <div>Another layer <Onion2 /></div>
    </Route>  
  </Routes>
)
  
// for /layer1/*
const Onion2 = () => (
  <Routes>
    <Route path={'layer2'}>
      <div>Innermost layer</div>
    </Route>  
  </Routes>
)
```

For this example the original way looks better, but if we wanna be honest, the real life case is:

**You kinda coding with solid-app-router**:

```jsx

const App = () => (
  <Router>
    <Route path={'/home'} element={<HomePage/>}/>
    <Route path={'/personal-account'} element={<PersonalAccountPage/>}/>
    <Route path={'/'} element={<Navigate href={'/home'}/>}/>
  </Router>
)

const HomePage = () => (
  <>
    <div>static HomePage info</div>
    <Link href={'/personal-account'}>Go to personal account</Link>
  </>
)

const PersonalAccountPage = () => {
  
  const [clicks, setClicks] = createSignal(0)
  
  const pages = createMemo(() => [
    {
      href: 'products',
      name: 'Products',
      component: ProductsComponent,
      props: {clicks: clicks()}
    },
    {
      href: 'billing',
      name: 'Billing',
      component: BillingComponent,
      props: {clicks: clicks()},
    },
  ])
  
  return (
    <>
      <div class={'nav left-part'}>
        <For each={pages()}>
          {page => (
            <Link href={page.href} class={'w-full'}>{page.name}</Link>
          )}
        </For>
        <button onClick={() => setClicks(clicks() + 1)}>Click me</button>
      </div>
      <div class={'container right-part'}>
        <For each={pages()}>
          {page => (
            <Route path={page.href} element={(<page.component {...page.props}/>)}/>
          )}
        </For>
      </div>
    </>
  )
}
```

And then the problems begin, "container right-part" routing just won't work, and you will read the docs and come to a conclusion:

> You **MUST** define routes only in a static way.

And then rewrite everything with extremely shitty `<Outlet/>` strategy and lots of cross-app storages, if at all possible.

### Conclusion
> **So, the only purpose of this library is to make routing workable and convenient.**

## Installation
`npm i @gh0st-work/solid-js-router`

## Usage
On the same example:
```jsx

import {Routes, Route, Link, Router, DefaultRoute} from '@gh0st-work/solid-js-router';

const App = () => (
  <Router>
    <Routes>
      <Route path={'/home'} fallback={true}>
        <HomePage/>
      </Route>
      <Route path={'/personal-account'} element={<PersonalAccountPage/>}/>
      <DefaultRoute to={'/home'}/>
    </Routes>
  </Router>
)

const HomePage = () => (
  <>
    <div>static HomePage info</div>
    <Link href={'/personal-account'}>Go to personal account</Link>
  </>
)

const PersonalAccountPage = () => {
  
  const [clicks, setClicks] = createSignal(0)
  
  const pages = createMemo(() => [
    {
      href: 'products',
      name: 'Products',
      component: ProductsComponent,
      props: {clicks: clicks()}
    },
    {
      href: 'billing',
      name: 'Billing',
      component: BillingComponent,
      props: {clicks: clicks()},
    },
  ])
  
  return (
    <>
      <div class={'nav left-part'}>
        <For each={pages()}>
          {page => (
            <Link href={page.href} class={'w-full'}>{page.name}</Link>
          )}
        </For>
        <button onClick={() => setClicks(clicks() + 1)}>Click me</button>
      </div>
      <div class={'container right-part'}>
        <Routes>
          <For each={pages()}>
            {page => (
              <Route path={page.href}>
                <page.component {...page.props}/>
              </Route>
            )}
          </For>
          <DefaultRoute to={'products'}/>
        </Routes>
      </div>
    </>
  )
}
```

> **And it just works perfectly.**


## API
### `<Router>`
Component for global routing management, use in only once, wrap your app in it.

### `<Routes>`
Component for defining your routes, just wrap them in it.

Props:
- **fallback** - JSX element if no available route found.<br>Not redirecting anywhere.
- **children** - default hidden prop

### `<Route>`
Just route component.

Props:
- **path** - relative path of your route.<br>Parsed via [regexparam](https://github.com/lukeed/regexparam), so you can use `*`. <br>Recommended starting from `/`, i.e. `/personal-account` -> `/products`.<br>Matching (i.e. `/user/:id`) not working for now, PRs are welcome.
- **children** - default hidden prop, your elements
- **fallback** - boolean (`true`/`false`).<br>If no available route found the first `fallback={true}` route will be used.<br>Not redirecting anywhere.

### `<Navigate>`
Component that will redirect on mount.

Props:
- **to** - link/href to redirect


### `<DefaultRoute>`
Just shortcut to:
```jsx 
<Route path={'*'}>
  <Navigate to={to}/>
</Route>
```

Insert it in the end of your routes and get rid of fallbacks.

Props:
- **to** - link/href to redirect, if no route found (`*` regex matching)


### `<Link>`
`<a>` tag with `e.preventDefault()`, to use this routing.

Props:
- **href** - link/href to redirect
- **beforeRedirect** - func that will be called onClick and before redirect<br>`({href, e}) => {}`
- **afterRedirect** - func that will be called onClick and after redirect<br>`({href, e}) => {}`
- **children** - default hidden prop, your elements
- **...otherProps** - will be inserted in `<a>` declaration.

Ex:
```jsx 
import {Link} from "solid-js-router";

const PersonalAccount = () => {
  return (
    <>
      <Link 
        href={'/home'} 
        class={'font-medium text-amber-500 hover:text-amber-400'} 
        beforeRedirect={({href, e}) => console.log(href, e)}
        afterRedirect={({href, e}) => console.log(href, e)}
      >
        Go home
      </Link>
      <Link 
        href={'/home'} 
        class={'text-white font-medium text-lg bg-amber-500 hover:bg-amber-400 flex items-center justify-center space-x-2 rounded-md px-4 py-2'} 
      >
        <i class={'w-4 h-4 fa-solid fa-house'}/>
        <span>Go home button</span>
      </Link>
    </>
  )
}
```

### `useHistory()`
History navigation, all apis from [**history** package](https://www.npmjs.com/package/history).

And `history.pathname()` (signal) used in routing.

Ex:
```jsx
import {useHistory} from "solid-js-router";

const Home = () => {
  const history = useHistory()
  
  return (
    <>
      <span>Current pathname: {history.pathname()}</span>
      <button onClick={() => history.push('/home')}>Go home</button>
      <button onClick={() => history.back()}>Go back</button>
    </>
  )
}
```
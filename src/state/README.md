# Application State explained

There are a few state islands that dictate the state of the App. They are all implemented as SolidJs Signals.

## [App Config](app_config.ts)

```
appState: AppConfig | undefined
```

## [App State](app_state.ts)

```
appState: {
    clientKind: ClientKind | undefined
}
```

## [Sidebar State](sidebar_state.ts)

```ts
sidebarItems: SidebarItem[]
activeItem: SidebarItem
sidebarVisibility: "visible" | "hidden"
```

# State flow of the application

## On Page load

On page load we extract some information from the url and direct the user always to the homepage. We have access to the following information before rendering anything (but being inside the Router Component):

- path
- query params

1. Construct the AppConfig from query params. Set the signal to this value. This should happen before anything is rendered.

2. Check the path. If...

   - path is already `/` (pointing to home) route to `/` the Home page.
   - path is pointing somewhere else, route to `/?redirect=$PATH` which is also the Home page.

3. Render the home page. The home page contains a few local variables that might need to get configured by the app config. E.g. what tab to show (url, metadata file, lightclient) and what content is in that tab.
   1. If the `redirect` query param is set, cache it in a local variable `redirectAfterGenerate`.
   1. If the clientKind field of the AppConfig is set to some value, we show the respective tab and tabContent (e.g. tab: url, content: "wss://rpc.polkadot.io"). Also we start the generation/client building immediately. The user will see a grayed out "Generate" Button with a loading spinner.
   1. ERROR CASE: "Generate" action causes an exception: show an error message on the Home Screen
   1. SUCCESS CASE: If `redirect` variable is set, use Router to navigate to that path + the url params that the config requires.

## On hitting Generate Button on Home Screen manually

1. Construct the clientKind from the respective tab on the home screen. Example: if the active tab is url and the user entered "wss://rpc.polkadot.io", we get the clientKind `{tag: "url", url: "wss://rpc.polkadot.io"}`.
2. Update the AppConfig state signal.
3. Update the query params in the URL (should now match the AppConfig state signal).
4. initAppState with the clientKind:
   - this makes a call to the Rust code in WASM handing the clientKind over.
   - the rust code constructs a client (including metadata) and hands all that back to the JS.
   - the JS now keeps this client object around ([appState](app_state.ts) is all about wrapping the client) for future function calls on it (e.g. requesting code examples or storage values)
   - the sidebar UI elements are computed and the respective signals updated, such that the sidebar is rendered with all the links.

Error Case (catch all exceptions during process above):

- An error message is set in the state of the Home Page.
- The "Generate" Button is unlocked again and the user can use the Home Page to start all over again.

## On Navigate to a different page (using SPA router navigation)

After the initial page load, the user stays conceptually on a single html page. All routing and query params are hash based (root url does not change).
This means, that if a user changes a part of the URL after the hash, no page reload is triggered. Changes to the URL therefore need to be handled by listeing to signals the Router emits.

On navigate:

- Extract an AppConfig from the new url we navigate to.
- Compare that to the AppConfig that is currently set.
- If there are differences, redirect to the home screen like on a first page load.

### Notes:

All links everywhere should be appended with the query params constructed from the AppConfig. Otherwise a user can run into cases where they cannot simply copy the URL and paste it somewhere else. There should be a memoized signal `appConfigSearchParamString` that computes this appendix every time the app config changes.

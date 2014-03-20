Imgeer
======

Imgeer is an image upload and sharing site in the spirit of the excellent image sharing site [Imgur](http://imgur.com) built to demonstrate building a non-trivial isomorphic application with [React](http://facebook.github.io/react/).

Architecture
------------

When the user interactions with the UI or the view otherwise needs to update the application state, it calls an `Action`.

An `Action` is a small facade around a call to the `Dispatcher`. The `Dispatcher` sends a message based on the action to every `Store` that is registered with it.

```
View -> Action (method invocation) -> Dispatcher (message passing)
                                        | | |
                                        v v v
                                     Data Stores
```

Each store may choose to (or not to) respond to the message. If it wants to respond, its registered dispatch handler returns a promise to the dispatcher that will eventually be resolved to that `Store`'s state.

The promise is also returned from the action method, primarily for use on the server (so we know when asynchronous data has been fetched).

```
View -> Action (method invocation) -> Dispatcher (message passing)
                                        ^   ^
                promise of new state -- |   |
                                     Data Stores
```

The `Dispatcher` collects the promises for any stores that responded to the dispatch and merges the resolved values into a single object, which is then emitted with an `stateUpdate` event, which the top-level view watches for. When it receives this event, it calls `setState`, re-rendering the UI.

### Server Rendering

On the server, we set up the `Store`s so that they use a server-appropriate strategy for responding to events. When a request comes in for a particular URL, we trigger the appropriate `Action`s and collect the promises returned. When they are all resolved, we render the top-level component as a string and pass in the merged state as a property.

Additionally, the merged state is provided to the client via a property on `window` so that the client-app can boot with the same data. This gives us server rendering of the application with a transparent upgrade to a fully functional front-end React app when the JavaScript loads.

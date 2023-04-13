# ![RealWorld Example App](logo.png)

> ### Angular 16@next with Signals codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Demo](https://ng-conduit-signals.onrender.com/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)&nbsp;&nbsp;&nbsp;&nbsp;[Stackblitz](https://stackblitz.com/github/nartc/ng-conduit-signals?preset=node/)

This codebase was created to demonstrate a fully fledged Front-end application built with **Angular 16@next w/ Signals** including CRUD operations, authentication, routing, pagination, and more.

This is to explore and showcase how **Angular 16@next w/ Signals** would look like in a project.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# Disclaimer

This implementation takes on the **Extreme Signals** approach in order to find a common ground where RxJS and Signals can
coexist happily in an Angular project.

I'm forcing myself to go as far as I could **without RxJS** so please keep that in mind. This implementation is also an
open invitation for you to tweak where you think RxJS makes more sense.

# How it works

> Describe the general architecture of your app here

-   API Clients are generated via `ng-openapi-generator` and they stay as Observables and are invoked with `lastValueFrom` to convert to Promise
-   `withComponentInputBinding` is also utilized for binding Route data to Routed Components' Inputs (check `feature-article`)
-   API calls happen based on User Events/Actions (click something, submit somthing, navigate into a component etc...) rather than Observable Stream
-   `status` (`ApiStatus`) signal is a bit of a pain-point and should be abstracted better. Usually when we work with API calls and RxJS, we'd usually have

```ts
this.trigger$.pipe(
    tap(() => this.loading$.next(true)),
    switchMap(() =>
        this.service.getData().pipe(
            tap({
                finalize: () => {
                    this.loading$.next(false);
                },
            })
        )
    )
);
```

This pattern is a bit _awkward_ with Signals if we want to keep _declarative_ mindset. `effect()` (and `toObservable()/fromSignal()` internally uses `effect()`) doesn't allow
writes to Signals by default. It's tricky to have:

```ts
effect(() => {
    this.loadin.set(true); // this is not
    const sub = this.service.getData().subscribe(() => {
        this.loading.set(false); // this is fine
    });
});
```

-   Without RxJS, we do forgo some forms of Race Condition handling as well as Cancellation. I'd assume the ecosystem like NgRx, RxAngular, NgXS are going to come up with
    some abstractions for this. The point is on the consumers' code, we don't need to think about RxJS vs Signals. It depends on the public APIs of these ecosystems.
-   `authGuard` still uses RxJS because I need the Guard to **wait** for the `AuthService`to have a chance to determine the initial authentication status.

# Current TODOs

-   There are couple places where we need to call `cdr.markForCheck()`. I'm not entirely sure why
-   Toggle Favorite on screens with Article List doesn't seem to update the UI regardless of what I try.

# Getting started

-   `npm install`
-   `npm run serve`

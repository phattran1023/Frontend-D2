
## Installation
Dillinger requires [Node.js](https://nodejs.org/) v18+ to run.

Install the dependencies and devDependencies and start the server.

```sh
npm i
Copy file environment.ts to environment.local.ts (config your local env)
npm start
```

## Policy
Setup policy for new component

_Example component's name is Document_

```sh
Step 1: Create file document.policy-collection.ts 
(see item.policy-collection.ts)

Step 2: Define policyCollectionKey 
(note: this key will use to check policy, see item.policy-collection.ts)

Step 3: Register DocumentPolicyCollection into PolicyModule 
(row 20, policy.module.ts)
```

How to use?

_HTML using_

Example we have this button and wanna check permission of user to SHOW or HIDDEN
```sh
<button type="button"> Create </button>
```
Add appPolicy directive  into button to check
```sh
Step 1: Import PolicyModule to component

Step 2: Add appPolicy [policy]="policyCollectionKey::functionName" into element

Example <button type="button" appPolicy [policy]="doc::create"> Create </button> 

("doc::create" -> policyCollectionKey is "doc", functionName is "create")
(See item.component.ts)
```

_JS using_
```sh
Inject PolicyService
Call function "can" to check
Example: this._policyService.can("policyCollectionKey::functionName")
```

## Routing
_See app.routes.ts_

If you wanna check AuthGuard, you have to add canActivate, example:
```sh
{
    path: 'xxx',
    canActivate: [AuthGuard],
    component: xxxComponent
}
```

If you wanna check policy for route, you have to add PolicyGuard to canActivate
```sh
{
    path: 'xxx',
    component: xxxComponent,
    canActivate: [PolicyGuard],
    data: {
        policy: 'policyCollectionKey::functionName'
    }
}
```
Example:

```sh
{
    path: 'item',
    component: ItemComponent,
    canActivate: [PolicyGuard],
    data: {
        policy: 'item::read'
    }
}
```

## Tailwind 
Link docs: [Tailwind](https://tailwindcss.com/docs/font-family)

Config css class to using likely font-size, color ...

Config in file tailwind.config.js
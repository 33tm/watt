# WATT Style Guide

The tentative WATT Style Guide™. Guidelines contained here are not strict requirements for a PR and no punishment will be incurred
for not following them strictly, but exist to document what I consider to look good and what I will typically refactor code to look like.

In general, WATT follows language and framework conventions, with a few extra guidelines sprinkled in for taste.
This guide will reiterate those conventions for ease of reference; relevant sections in outside style guides will be linked.

## General
### 1.1 — Prefer semicolonfull to semicolonless code
```ts
// Prefer
const num = 100;
// to
const num = 100
```
This helps with ASI ambiguity and makes clearer the intentions for where a line ends.

### 1.2 — Use 4-space tabs
```ts
// Prefer
for (const club of clubs) {
    console.log(club.name);
}
// to
for (const club of clubs) {
  console.log(club.name);
}
// or
for (const club of clubs) {
	console.log(club.name);
}
```
Most modern IDEs automatically convert tab key presses to spaces, and using spaces instead of tab characters lets _you_ control
how wide your tabs are (avoiding, for example, GitHub's massive 8-space tab characters).

### 1.3 — Prefer using `const` over `let` for immutable variables
```ts
// Prefer
const data = JSON.parse(localStorage.getItem('data'));
console.log(data.timestamp);

// to
let data = JSON.parse(localStorage.getItem('data'));
console.log(data.timestamp);
```
This better enforces mutability and makes it easier to tell what is a reassignable field and what is immutable data.

### 1.4 — Leave 2 newlines between imports and code
```ts
// Prefer
import fetch from 'node-fetch';
import {readFileSync, writeFileSync} from 'fs';


const prev = JSON.parse(readFileSync('./input/clubs.json').toString());
// ...
writeFileSync('./output/clubs.json', JSON.stringify(prev, null, 4));
// ...
```

### 1.5 — Group imports if importing many things at once
<!-- TODO: these examples are super lengthy; we should shorten if possible -->
```ts
// Prefer
import { useContext, useEffect, useState } from 'react';
import {Routes, Route, Link, useMatch, useResolvedPath} from 'react-router-dom';

// Components
import Dashboard from '../components/classes/Dashboard';
// ...

// Contexts
import CurrentTimeContext from '../contexts/CurrentTimeContext';
// ...

// Utilities
import { parsePeriodColor } from '../components/schedule/Periods';
// ...

// to
import { useContext, useEffect, useState } from 'react';
import {Routes, Route, Link, useMatch, useResolvedPath} from 'react-router-dom';
import Dashboard from '../components/classes/Dashboard';
import Upcoming from '../components/classes/Upcoming';
import Materials from '../components/classes/Materials';
import SgySignInBtn from '../components/firebase/SgySignInBtn';
import Loading from '../components/layout/Loading';
import RedBackground from '../components/layout/RedBackground';
import CurrentTimeContext from '../contexts/CurrentTimeContext';
import UserDataContext, { SgyData, SgyPeriodData, UserData } from '../contexts/UserDataContext';
import { parsePeriodColor } from '../components/schedule/Periods';
// ...
```
Even if not spacing with newlines and comments, prefer ordered and grouped imports over arbitrary patterns:
```ts
// The worst import pattern
import Materials from '../components/classes/Materials';
import { useContext, useEffect, useState } from 'react';
import {Routes, Route, Link, useMatch, useResolvedPath} from 'react-router-dom';
import RedBackground from '../components/layout/RedBackground';
import UserDataContext, { SgyData, SgyPeriodData, UserData } from '../contexts/UserDataContext';
import Dashboard from '../components/classes/Dashboard';
import { parsePeriodColor } from '../components/schedule/Periods';
import Upcoming from '../components/classes/Upcoming';
import SgySignInBtn from '../components/firebase/SgySignInBtn';
import CurrentTimeContext from '../contexts/CurrentTimeContext';
import { useScreenType } from '../hooks/useScreenType';
import Loading from '../components/layout/Loading';
// ...
```

### 1.6 — Prefer importing functions directly instead of using default imports where possible
```ts
// Prefer
import {readFileSync, writeFileSync} from 'fs';
writeFileSync('./output/data.json', ...);

// to
import fs from 'fs';
fs.writeFileSync('./output/data.json', ...);
```
This allows readers to ascertain exactly what from `fs` is used at a glance, without having to search for references of
the `fs` object.

### 1.7 — Prefer minimizing extra newlines from curly braces
```tsx
// Prefer
if (!signedIn) return <div>You are not signed in!</div>
// or
if (!signedIn) 
    return <div>You are not signed in! Sign in to WATT via the sidebar.</div>
// to
if (!signedIn) {
    return <div>You are not signed in!</div>
}
```
Exceptions to this rule may apply on a case by case basis.

### 1.8 — Leave spaces around `if` and `for` conditions and operators and after `:`s in object and type declarations
<!-- This is sorta just common style convention; should this section be removed? -->
```ts
// Prefer
if (!description) {
    // ...
}
for (let i = 0; i < arr.length; i++) {
    // ...
}

// to
if(!description){
    // ...
}
for(let i = 0; i < arr.length; i++){
    // ...
}
```
```ts
// Prefer
const final = {timestamp: new Date(), data: {}};
const ratio = 12 / 36;
const reason = parsed.reason ?? 'No reason given';
sum += 1;

// to
const final={timestamp:new Date(),data:{}};
const ratio=12/36;
const reason=parsed.reason??'No reason given';
sum+=1;
```
```ts
// Prefer
type ContainerProps = {size: string, className: string};
// to
type ContainerProps={size:string,className:string};
```
Conversely, do not leave a space when invoking a function or before or after an explicit generic type argument.
```ts
// Prefer
const [state, setState] = useState<string | null>(null);
console.log(state);

// to
const [state, setState] = useState <string | null> (null);
console.log (state);
```

## React
### 2.1 — Prefer functional components to arrow functions
```tsx
// Prefer
export default function Sidebar(props: ...) {
    // ...
}

// to
const Sidebar = (props: ...) => {
    // ...
}
export default Sidebar;
```
This disallows use of `React.FC<T>` but use of that is [inadvised](https://gist.github.com/ky28059/c74ad68be64510af55bba9c6828b2942#props-with-manual-typing) anyhow.

### [2.2 — Prefer `'` to `"`, except in JSX props](https://github.com/airbnb/javascript/tree/master/react#quotes)
```tsx
// Prefer
import { ... } from 'react';
// to
import { ... } from "react";
```
```tsx
// Prefer
const str = 'some string';
// to
const str = "some string";
```
```tsx
// Prefer
<div className="wrapper">...</div>
// to
<div className='wrapper'>...</div>
```
As a side note, avoid using `prop={}` for simple string values:
```tsx
// Prefer
<div className="wrapper">...</div>
// to
<div className={"wrapper"}>...</div>
// or
<div className={'wrapper'}>...</div>
// or
<div className={`wrapper`}>...</div>
```

### [2.3 — Use parentheses for multiline JSX](https://github.com/airbnb/javascript/tree/master/react#parentheses)
```tsx
// Prefer
return (
    <div>
        <h1>...</h1>
        <p>...</p>
    </div>
);

// to
return <div>
    <h1>...</h1>
    <p>...</p>
</div>
```
This allows the outer JSX element to remain aligned and look more and akin to HTML.

### [2.4 — Wrap long prop declarations properly](https://github.com/airbnb/javascript/tree/master/react#alignment)
```tsx
// Prefer
<GenericCalendar
    dayClass={(day) => {
        // ...
    }}
    onClickDay={(day) => {
        // ...
    }}
    start={...}
/>
// to
<GenericCalendar dayClass={(day) => ...} onClickDay={(day) => ...} start={...} />
// or
<GenericCalendar dayClass={(day) => {
        // ...
    }} onClickDay={(day) => {
        // ...
    }} start={...} />
```
```tsx
// Prefer
<div
    onClick={(e) => ...}
    style={{...}}
>
    <h1>...</h1>
    <p>...</p>
</div>

// to
<div
    onClick={(e) => ...}
    style={{...}}>
    <h1>...</h1>
    <p>...</p>
</div>
```

### 2.5 — Use default exports for components
```tsx
// Prefer
export default function Container() {
    // ...
}
// to
export function Container() {
    // ...
}
```
```tsx
// Prefer
import Container from './components/Container';
// to
import {Container} from './components/Container';
```
This is a React convention and helps reinforce the idea that you should only have one exported component per file:
```tsx
// Prefer
// Header.tsx
export default function Header() {
    // ...
}
// Footer.tsx
export default function Footer() {
    // ...
}

// to
// Layouts.tsx
export function Header() {
    // ...
}
export function Footer() {
    // ...
}
```
Note that exceptions apply for small layout components extracted from their parent components who are linked enough 
to their parent to warrant staying in their own file; exporting `<Header>` and `<Footer>` from `Layouts.tsx` violates
principles of code-splitting and organization, but a `<HeaderBox>` component extracted for reuse from `<Header>` is 
acceptable:
```tsx
// Header.tsx
export default function Header() {
    // ...
    return (
        <div>
            <HeaderBox>...</HeaderBox>
            <nav>...</nav>
            ...
        </div>
    )
}

export function HeaderBox(props: {children: ReactNode}) {
    return (
        <header className="rounded shadow-lg bg-theme ...">
            {props.children}
        </header>
    )
}

// ClassesHeader.tsx
import {HeaderBox} from './Header';

export default function ClassesHeader() {
    // ...
    return (
        <div>
            <HeaderBox>Classes</HeaderBox>
            ...
        </div>
    )
}
```
If a component contains sizeable or complex logic or is otherwise unrelated to its host file, it may be a good indicator
that that component needs its own file.

### 2.6 — Use the [boolean prop shortcut](https://gist.github.com/ky28059/c74ad68be64510af55bba9c6828b2942#boolean-props-shortcut)
```tsx
// Prefer
<Sidebar closed />
// to
<Sidebar closed={true} />
```

### 2.7 — Prefer explicitly declaring prop types via `type` as opposed to inlining
```tsx
// Prefer
type ContainerProps = {...};
export default function Container(props: ContainerProps) {
    // ...
}
// to
export default function Container(props: {...}) {
    // ...
}
```
This is so that if the prop type is needed elsewhere, it can quickly be `export`ed. Also, huge inline declarations create
very long lines:
```tsx
export default function ClubComponent(props: {name: string, id: string, teacher: string, room: string, prez: string, coadvisor?: string, desc: string, ...}) {
    // ...
}
```
Prefer not to destructure props directly in the function arguments for similar reasons:
```tsx
// Prefer
export default function ClubComponent(props: ClubComponentProps) {
    const {name, id, teacher, room, prez, coadvisor, desc} = props;
    // ...
}
// to
export default function ClubComponent({name, id, teacher, room, prez, coadvisor, desc}: ClubComponentProps) {
    // ...
}
```
An exception applies for `props.children` on components which are guaranteed to only require that prop.
```tsx
// This is ok, because this is guaranteed to never need any other props than the children being wrapped by the providers
export default function FirebaseProviders(props: {children: ReactNode}) {
    return (
        <AuthProvider sdk={auth}>
            <FunctionsProvider sdk={functions}>
                ...
                    {props.children}
                ...
            </FunctionsProvider>
        </AuthProvider>
    )
}
```

### 2.8 — Prefer `{x && y}` to `{x ? y : null}`
```tsx
// Prefer
{!signedIn && <div>You are not signed in!</div>}
// to
{!signedIn ? <div>You are not signed in!</div> : null}
```
React automatically [discards and doesn't render `false`](https://reactjs.org/docs/conditional-rendering.html#inline-if-with-logical—operator), 
allowing the `&&` syntactic sugar for conditional rendering without having to coerce the value to `null`.

### 2.9 — Do not pass context as props
```tsx
// Prefer
export default function Home() {
    const time = useContext(CurrentTimeContext);

    return (
        <div>
            <Clock />
            ...
        </div>
    );
}

function Clock() {
    const time = useContext(CurrentTimeContext);
    // ...
}

// to
export default function Home() {
    const time = useContext(CurrentTimeContext);

    return (
        <div>
            <Clock time={time} />
            ...
        </div>
    );
}

type ClockProps = {time: Moment};
function Clock(props: ClockProps) {
    const {time} = props;
    // ...
}
```
The point of context is to eliminate having to pass "global" values as props down the tree and having the child subscribe
to the context is functionally the same (while being more readable) than passing the value downwards.

### [2.10 — Use `/>` to close an empty element](https://github.com/airbnb/javascript/tree/master/react#tags)
```tsx
// Prefer
<div className="w-8 h-8 bg-red-500 rounded-full ..." />
// to
<div className="w-8 h-8 bg-red-500 rounded-full ..."></div>
```
The self-closing tag looks cleaner and more intuitive and will compile to the same code at build time.

### 2.11 — Do not use React's default import
```tsx
// Prefer
import {ReactNode} from 'react';
type ContainerProps = {children: ReactNode};

// to
import React from 'react';
type ContainerProps = {children: React.ReactNode};

// or
import React, {ReactNode} from 'react';
type ContainerProps = {children: ReactNode};
```
This is to accommodate for React 17's [new JSX transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) 
which no longer requires `React` to be in scope wherever JSX is used.

### 2.12 — When exporting a component by default, the file name should agree with the component's name
```tsx
// Prefer
// UpcomingFullCalendar.tsx
export default function UpcomingFullCalendar() {
    // ...
}
// to
// FullCalendar.tsx
export default function UpcomingFullCalendar() {
    // ...
}
```
```tsx
// Prefer
import UpcomingFullCalendar from './UpcomingFullCalendar';
// to
import UpcomingFullCalendar from './FullCalendar';
```
This prevents confusion between the name of a component and which file it's exported from.

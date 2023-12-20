# Developing on Next.js 14

Next.js is more or less a full stack framework, allowing you to setup backend services for business logic as well! 

## Create a Next.js Project

Create a new react app in your current folder: 

```bash
npx create-next-app@latest .
```

![](Developing%20on%20Next.js%2014%20-%20create%20new%20nextjs%20app.png)

## File & Folder Structure

### page.tsx files

This represents the page route for the application. On the `/app/page.tsx` this usually represents the Home page.

By default all of the page routers enable server side rendering. This results in higher page reloading speed, better SEO, and overall a better user experience. If you wish to turn a server side component into a client side component, you only have to add `"use client"` directive to the top of the page.

### loader.tsx

While `page.tsx` is loading, the `loader.tsx` is what will be shown. This allows us to easily display some premade information, or a web skeleton of how the web-site is supposed to look. You can also just add a spinner, if that is what you want here.

### layout.tsx files

/app/layout.tsx: This is the root layout file which is drawn on all other pages. Any components added to this file will be shared throughout your entire application. This is usually a good place to add a header and footer section around your body. See [Pages and Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts) for more documentation.

Each page can have their own layout, which will propagate down to their children and sub pages as well. 

#### Example Code

```tsx
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div>
      <h1>/posts</h1>
      {children}
    </div>
  );
};

export default Layout;
```

### error.tsx files

When a web-site won't load correctly, we can use the `error.tsx` as our fallback page. Here we can give the user the option to "try again" or go back, or however else you may want to handle errors that prevent the `page.tsx` from loading correctly.  
You can place these next to any `page.tsx` to show this error component whenever the page fails to load. 

- `error.tsx` must be a client component 

#### Example Code

```tsx
"use client";

import React, { useEffect } from "react";

type Props = {
  error: string;
  reset: () => void;
};

const Error = ({ error, reset }: Props) => {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
};

export default Error;

```

## Using SSR, SSG, ISR

### Server Side Rendering

The server will call the API every time the page loads. This is great if you want to call an internal API you don't want to expose to the client.

```tsx
import React from "react";

type Props = {};

const Jokes = async (props: Props) => {
  const response = await fetch(`https://icanhazdadjoke.com/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const { joke } = await response.json();

  return (
    <div className="container flex justify-center items-center h-screen">
      <h3 className="text-center">{joke}</h3>
    </div>
  );
};

export default Jokes;

```

### Static SIte Generation

The server will only call the API once before generating a static page of it. This is great for displaying content that will not change. 

```tsx
import React from "react";

type Props = {};

const Jokes = async (props: Props) => {
  const response = await fetch(`https://icanhazdadjoke.com/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const { joke } = await response.json();

  return (
    <div className="container flex justify-center items-center h-screen">
      <h3 className="text-center">{joke}</h3>
    </div>
  );
};

export default Jokes;

```

### Incremental Static Generation

ISG is the best of both worlds. The server will call the API and generate static content to display to the user for a while, but at specified time intervals it will re-call the API to fetch updated data if someone attempts to load the page after the `revalidate` have been exceeded.  

```tsx
import React from "react";

type Props = {};

const Jokes = async (props: Props) => {
  const response = await fetch(`https://icanhazdadjoke.com/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 10 }, 
  });

  const { joke } = await response.json();

  return (
    <div className="container flex justify-center items-center h-screen">
      <h3 className="text-center">{joke}</h3>
    </div>
  );
};

export default Jokes;

```

## Client vs Server Components

> [!info] Official documentation: [When to use Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#when-to-use-server-and-client-components).

**When should I use server components?**
- For fetching data
- Keeping private info private
- When using large dependencies to reduce client side javascript
- When accessing backend resources directly

When should I use client components?
- When you need to add interactivity or even listeners
- For UseState and other lifecycle events
- Using browser-only APIs
- To use custom hooks that depends on state, or other effects
- When you want to use browser-only APIs

Essentially you want to use server side components by default until you have a **need** to use client side components.

## Creating and exposing an API 

The best practice approach seem to be creating an `/app/api/` folder for your API routes.  
When you create a `route.tsx`, all you have to do is to create and export one or more of the following function names `GET`, `POST`, `DELETE`, `PUT`, `PATCH` or `HEAD`.

### Code Example 

Given that we want to expose an API to fetch events: http://localhost/api/events 

```tsx
import React from "react";

type Request = {};

export const GET = (request: Request) => {
  const eventData = [
    { year: "2024", title: "Event of 2024", description: "Best event ever!" },
    { year: "2023", title: "E-2023", description: "Free snacc" },
  ];

  return new Response(JSON.stringify(eventData));
};

```

## Working with SEO

We have two ways of handling SEO:
- For static pages
- For dynamic pages

### Static page metadata

The far easiest way to add SEO is by using the static page metadata. 

#### Example Code

Here we have set title to "Best Jokes", which will automatically be set on the page. When you load the page you will see "Best Jokes" in the page tab in your browser.

```tsx
import React from "react";

type Props = {};

export const metadata = {
  title: "Best Jokes",
};

const Jokes = async (props: Props) => {
  const response = await fetch(`https://icanhazdadjoke.com/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    // cache: "no-store", // Calls the API every time a user visits the page
    next: { revalidate: 30 }, // Stores the API call for a certain amount of time, great for content that change from time to time!
  });

  const { joke } = await response.json();

  return (
    <div className="container flex justify-center items-center h-screen">
      <h3 className="text-center">{joke}</h3>
    </div>
  );
};

export default Jokes;

```

### Dynamic page metadata

Unlike static pages, for dynamic pages we can setup an async `generateMetadata` function, and populate the data we need from our own APIs or functions.

#### Example Code

 `/pages/[postId]/page.tsx` 

 > The async `getPost` function was added for the use-case example, it does not exist

```tsx
import React from "react";

type Props = {
  params: {
    postId: string;
  };
};

export const generateMetadata = async ({ params }: Props) => {
  const post = await getPost(params.postId);
  return { title: post.title };
};

const page = ({ params: { postId } }: Props) => {
  return <div>POST ID: {postId}</div>;
};

export default page;

```

# References

- [Next.js 14 Full Course 2023 | Build and Deploy a Full Stack App Using the Official React Framework](https://www.youtube.com/watch?v=wm5gMKuwSYk)
- [Next.js Documentation - Building your application](https://nextjs.org/docs/app/building-your-application)

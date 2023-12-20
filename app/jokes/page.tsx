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

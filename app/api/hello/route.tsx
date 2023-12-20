import React from "react";

type Request = {};

export const GET = (request: Request) => {
  const eventData = [
    { year: "2024", title: "Event of 2024", description: "Best event ever!" },
    { year: "2023", title: "E-2023", description: "Free snacc" },
  ];

  return new Response(JSON.stringify(eventData));
};

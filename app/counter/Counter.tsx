"use client";

import React, { useState } from "react";

type Props = {};

const Counter = (props: Props) => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increase Me</button>
    </div>
  );
};

export default Counter;

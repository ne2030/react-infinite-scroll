import { useEffect, useState } from "react";
import { map, range, toArray } from "@fxts/core";
import "./styles.css";
import { useInfinite } from "./hooks/useInfinite";
import Infinite from "./Infinite";

export default function App() {
  const [items, setItems] = useState(toArray(range(10000)));

  const infiniteOptions = {
    items,
    selKey: (n) => n.toString(),
    getItems: () => {},
    maxRenderCount: 100,
    pageRenderCount: 30,
    createItemView: (n: number, ref) => (
      <div className="row" key={n} data-key={n}>
        number is: {n}
      </div>
    ),
    scrollElement: document.scrollingElement
  };

  // const [tmp, setTmp] = useState(toArray(range(20)));

  return (
    <div className="App">
      {/* <div className="scrollContainer">
        <Infinite {...infiniteOptions} className="wrapper" />
      </div> */}

      <Infinite {...infiniteOptions} className="wrapper" />

      {/* {tmp.map((n) => (
        <div className="row" key={Math.random()}>
          number is: {n}
        </div>
      ))} */}
      {/* <div style={{ width: "40%" }}>
        <button>scoll 계산</button>
      </div> */}
    </div>
  );
}

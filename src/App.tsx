import { useEffect, useState } from "react";
import { flat, map, range, last, toArray } from "@fxts/core";
import "./styles.css";
import { useInfinite } from "./hooks/useInfinite";
import Infinite from "./Infinite";

export default function App() {
  const [items, setItems] = useState(toArray(range(200)));

  const fetchCount = 100;

  const infiniteOptions = {
    items,
    selKey: (n) => n.toString(),
    getItems: () => {
      const lastItem = last(items);
      const newItems = range(lastItem + 1, lastItem + fetchCount);
      setTimeout(() => {
        setItems(toArray(flat([items, newItems])));
      }, 500)
    },
    maxRenderCount: 200,
    pageRenderCount: fetchCount,
    createItemView: (n: number, ref) => (
      <div className="row" key={n} data-key={n} ref={ref}>
        number is: {n}
      </div>
    ),
    scrollElement: document.scrollingElement
  };

  // const [tmp, setTmp] = useState(toArray(range(20)));

  return (
    <div className="App">
      <div className="scrollContainer">
        <Infinite {...infiniteOptions} className="wrapper" />
      </div>


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

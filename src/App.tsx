import { useEffect, useState } from "react";
import { flat, map, range, last, toArray } from "@fxts/core";
import "./styles.css";
import { useInfinite } from "./hooks/useInfinite";
import Infinite from "./Infinite";

export default function App() {
  const [items, setItems] = useState(toArray(range(200)));
  const [removed, setRemoved] = useState<number[]>([]);

  const fetchCount = 100;

  const remove = (n) => {
    setItems(prev => prev.filter(p => p !== n));
    setRemoved(prev => [...prev, n]); // remove test
  }

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
    maxRenderCount: 500,
    pageRenderCount: fetchCount,
    createItemView: (n: number, ref) => (
      <div className="row" style={{ backgroundColor: removed.includes(n) ? 'red' : 'transparent'}} key={n} data-key={n} ref={ref} onClick={() => remove(n)}>
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

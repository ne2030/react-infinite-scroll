import { useEffect, useRef, useState } from "react";
import { flat, map, range, last, toArray } from "@fxts/core";
import "./styles.css";
import { useInfinite } from "./hooks/useInfinite";
import Infinite from "./Infinite";

export default function App() {
  const [items, setItems] = useState(toArray(range(200)));
  const [removed, setRemoved] = useState<number[]>([]);
  const scrollElRef = useRef();

  useEffect(() =>{
    setTimeout(() => {
      setItems(toArray(range(-2000, 400)))
    }, 1000)
  }, [])

  const fetchCount = 40;
  const colors = ['black', 'gray', 'blue', 'red', 'orange', 'pink', 'skyblue', 'yellow', 'purple']

  const remove = (n) => {
    setItems(prev => prev.filter(p => p !== n));
    setRemoved(prev => [...prev, n]); // remove test
  }

  const infiniteOptions = {
    items,
    maxRenderCount: 500,
    selKey: (n) => n.toString(),
    getItems: () => {
      const lastItem = last(items);
      const newItems = range(lastItem + 1, lastItem + fetchCount);
      setTimeout(() => {
        setItems(toArray(flat([items, newItems])));
      }, 500)
    },
    pageRenderCount: fetchCount,
    createItemView: (n: number, ref) => {
      return (
          <div className="row" style={{ backgroundColor: removed.includes(n) ? 'red' : 'transparent'}} key={n} data-key={n} ref={ref} onClick={() => remove(n)}>
            <div>
              title: hello world
            </div>
            <div style={{ color: colors[n % colors.length], display: 'flex'}}>
              <div>
                <div>
                  <div>
                    <div>
                      <div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div>
                          <div></div>
                          <div>
                            <div>deep nested div</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p style={{ margin: 0, marginLeft: '200px', color: 'black' }}>{n}</p>
              </div>
            </div>
          </div>
      )
    },
    scrollElement: scrollElRef.current || document.scrollingElement
  };

  // const [tmp, setTmp] = useState(toArray(range(20)));

  return (
    <div className="App">
      <div className="scrollContainer" ref={scrollElRef}>
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

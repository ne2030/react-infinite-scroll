import { useEffect, useRef, useState } from 'react';
import { pipe, flat, map, range, last, toArray } from '@fxts/core';
import './styles.css';
import { useInfinite } from './hooks/useInfinite';
import Infinite from './Infinite';

type Item = {
  value: number;
  width: string;
};

const createItems = (start: number, end?: number) =>
  pipe(
    range(start, end),
    map((value) => ({
      value,
      width: `${Math.floor(Math.random() * 5) * 10}%`,
    })),
    toArray,
  );

export default function App() {
  const [items, setItems] = useState<Item[]>(createItems(200));
  const [removed, setRemoved] = useState<number[]>([]);
  const scrollElRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      setItems(createItems(-2000, 400));
    }, 1000);
  }, []);

  console.log(items.slice(0, 100));

  const fetchCount = 40;
  const colors = [
    'black',
    'gray',
    'blue',
    'red',
    'orange',
    'pink',
    'skyblue',
    'yellow',
    'purple',
  ];

  const remove = (n) => {
    setItems((prev) => prev.filter((p) => p !== n));
    setRemoved((prev) => [...prev, n]); // remove test
  };

  const infiniteOptions = {
    items,
    maxRenderCount: 500,
    selKey: (n) => n.value.toString(),
    getItems: () => {
      const lastItem = last(items);
      const newItems = createItems(
        lastItem.value + 1,
        lastItem.value + fetchCount,
      );
      setTimeout(() => {
        setItems(toArray(flat([items, newItems])));
      }, 500);
    },
    pageRenderCount: fetchCount,
    createItemView: (item: Item, ref) => {
      return (
        <div
          className="row"
          style={{
            backgroundColor: removed.includes(item.value)
              ? 'red'
              : 'transparent',
          }}
          key={item.value}
          data-key={item.value}
          ref={ref}
          onClick={() => remove(item.value)}
        >
          <div>title: hello world</div>
          <div
            style={{
              color: colors[Math.abs(item.value) % colors.length],
              display: 'flex',
            }}
          >
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
                          <img
                            style={{
                              width: item.width,
                            }}
                            src="https://i5.walmartimages.com/asr/c28d142c-b688-4a80-ad81-d93a7e1df85e.eefda302c95a33b6ee7ea75b663d4744.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF"
                            alt=""
                          />
                          <div>deep nested div</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p style={{ margin: 0, marginLeft: 'auto', color: 'black' }}>
              {item.value}
            </p>
          </div>
        </div>
      );
    },
    scrollElement: scrollElRef.current || document.scrollingElement,
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

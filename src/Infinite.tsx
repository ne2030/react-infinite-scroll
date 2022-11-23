import { ReactNode, createRef } from "react";
import { useInfinite } from "./hooks/useInfinite";
import { InfiniteCore } from "./types/types";

type InfiniteProps<Data> = {
  className?: string;
  createItemView: (
    d: Data,
    ref: React.RefObject<unknown>
  ) => ReactNode | JSX.Element; // 데이터를 기반으로 Item 컴포넌트를 생성하는 함수
} & InfiniteCore<Data>;

export default function Infinite<Data>(props: InfiniteProps<Data>) {
  const { topObserver, bottomObserver, infiniteItems, refs } = useInfinite<
    Data
  >({
    getItems: props.getItems,
    items: props.items,
    selKey: props.selKey,
    maxRenderCount: props.maxRenderCount,
    pageRenderCount: props.pageRenderCount,
    scrollElement: props.scrollElement || document.scrollingElement
  });

  return (
    <div className={props.className}>
      <div ref={topObserver.ref}></div>
      {infiniteItems.map((item, idx) => {
        return props.createItemView(item, refs[idx]);
      })}
      <div ref={bottomObserver.ref}></div>
    </div>
  );
}

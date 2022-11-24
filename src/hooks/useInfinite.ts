import { createRef, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { InfiniteCore, InfiniteTypes } from '../types/types';
import { head, last, take, takeRight, toArray } from '@fxts/core';

type InfiniteOptions<Data> = InfiniteCore<Data> & {};

const DEBUG = true;

const debug = (log: any) => {
  if (DEBUG) {
    console.log(log);
  }
};

export const useInfinite = <Data>(options: InfiniteOptions<Data>) => {
  const {
    items,
    pageRenderCount,
    selKey,
    preloadMargin,
    scrollElement,
    maxRenderCount,
    getItems,
  } = options;

  const limitMaxItems = (
    newItems: Data[] | IterableIterator<Data>,
    direction: InfiniteTypes['direction'] = 'top',
  ) => {
    const limitedItems = (direction === 'top' ? take : takeRight)(
      maxRenderCount,
      newItems,
    );

    return toArray(limitedItems);
  };

  // const adjustScroll = (
  //   direction: InfiniteTypes["direction"],
  //   targetEl: Element
  // ) => {
  //   console.log("rect", targetEl.getBoundingClientRect());
  //   setTimeout(() => {
  //     console.log("rect2", targetEl.getBoundingClientRect());
  //   }, 500);
  // };

  /*
   * 데이터 관리
   */

  // const [items, setItems] = useState(options.initialItems || []);

  // 축약된 데이터 목록 - 그릴 데이터만 관리
  const [infiniteItems, setInfiniteItems] = useState(limitMaxItems(items));
  const scrollPositionRef = useRef<{ top: number; key: string } | null>(null);
  const [toBeAdded, setToBeAdded] = useState<{
    items: Data[];
    direction: InfiniteTypes['direction'];
  } | null>(null);

  // key 관리 ref, 이걸로 비교 연산 진행 (최적화)
  const keysRef = useRef(items.map(selKey));

  const bottomFinishedRef = useRef(false);
  const topFinishedRef = useRef(false);

  const refs = infiniteItems.map(() => createRef<Element>());

  const retryObserverCallbackRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [shouldRetry, retry] = useState(false);
  const [initialMinScroll, setInitialMinScroll] = useState(false);

  /*
   * State manage Funtions
   */

  // items 상태 관리하는 proxy
  // const setInfiniteItems = (items?: Data[] | ((prev: Data[]) => Data[])) => {
  //   keysRef.current = items.map(options.selKey);
  //   _setInfiniteItems(items);
  // };

  useEffect(() => {
    if (
      !initialMinScroll &&
      scrollElement.clientHeight < scrollElement.scrollHeight
    ) {
      scrollElement.scrollTo(0, 1);
      setInitialMinScroll(true);
    }
  }, [infiniteItems]);

  const createRetryTimer = () => {
    return setTimeout(() => {
      retry(true);
    }, 300);
  };

  // 제거 / 추가를 다른 프레임으로 분리해서 진행 (스크롤 이슈 해결 위해서)
  const addItems = (
    newItems: Data[],
    direction: InfiniteTypes['direction'],
  ) => {
    const removeCount = newItems.length + infiniteItems.length - maxRenderCount;

    const itemsAfterRemove =
      direction === 'bottom'
        ? infiniteItems.slice(removeCount)
        : infiniteItems.slice(0, -removeCount);

    debug('Removed!!');

    // remove 먼저
    setInfiniteItems(itemsAfterRemove);

    // 다음으로 추가 넘김
    setToBeAdded({ items: newItems, direction });
  }; // 수동 아이템 데이터 추가

  /*
   * Effect 관리
   */

  const topObserver = useInView({
    /* Optional options */
    root: scrollElement,
    threshold: 0,
    rootMargin: `${window.innerHeight}px 0px 0px 0px`,
  });

  const bottomObserver = useInView({
    /* Optional options */
    root: scrollElement,
    threshold: 0,
    rootMargin: `0px 0px ${window.innerHeight}px 0px`,
  });

  // 아이템 추가 렌더링
  useEffect(() => {
    if (!toBeAdded) return;

    const totalItems =
      toBeAdded.direction === 'bottom'
        ? [...infiniteItems, ...toBeAdded.items]
        : [...toBeAdded.items, ...infiniteItems];

    debug('Added!!');

    if (toBeAdded.direction == 'top') {
      scrollPositionRef.current = {
        top: refs[0].current.getBoundingClientRect().top,
        key: selKey(infiniteItems[0]),
      };
    }

    setInfiniteItems(totalItems);
  }, [toBeAdded]);

  /*
   * Top
   */

  useEffect(() => {
    if (!topObserver.inView) return retry(false);

    debug('Observe:: (top) ');

    const firstIdx = items.findIndex(
      (a) => selKey(a) == selKey(head(infiniteItems)),
    );

    const toBeAddedItems = items.slice(
      Math.max(0, firstIdx - pageRenderCount),
      firstIdx,
    );

    if (toBeAddedItems.length === 0) return;

    retryObserverCallbackRef.current = createRetryTimer();

    addItems(toBeAddedItems, 'top');
  }, [topObserver.inView, items, shouldRetry]);

  /*
   * Bottom
   */

  useEffect(() => {
    // debug(`Effect:: (bottom: ${bottomObserver.inView})`)
    if (!bottomObserver.inView) return retry(false);

    // retry 체크 타이머 제거
    if (retryObserverCallbackRef.current) {
      clearTimeout(retryObserverCallbackRef.current);
      retryObserverCallbackRef.current = null;
    }

    debug('Observe:: (bottom) ');

    const lastIdx = items.findIndex(
      (a) => selKey(a) === selKey(last(infiniteItems)),
    );

    // 가지고 있는 아이템이 부족할 경우 추가 fetch
    // finish 인 경우는 끝
    if (
      lastIdx + pageRenderCount + 1 >= items.length &&
      !bottomFinishedRef.current
    ) {
      // fetch and wait "items" change
      // debug('Fetch:: (bottom)')
      // debug({lastIdx, pageRenderCount, item_len: items.length})
      getItems(selKey(last(items)));
      return;
    }

    const toBeAddedItems = items.slice(
      lastIdx + 1,
      lastIdx + 1 + pageRenderCount,
    );

    if (toBeAddedItems.length === 0) return debug('Out:: (bottom)');

    retryObserverCallbackRef.current = createRetryTimer();

    addItems(toBeAddedItems, 'bottom');

    // adjustScroll("bottom", refs[refs.length - 1].current);
  }, [bottomObserver.inView, items, shouldRetry]);

  const setFinished = (direction: InfiniteTypes['direction']) => {
    if (direction === 'top') {
      topFinishedRef.current = true;
    } else {
      bottomFinishedRef.current = true;
    }
  };

  const reset = () => {
    topFinishedRef.current = false;
    bottomFinishedRef.current = false;
    setInfiniteItems([]);
  };

  return {
    bottomObserver,
    topObserver,
    addItems,
    infiniteItems,
    refs,
  };
};

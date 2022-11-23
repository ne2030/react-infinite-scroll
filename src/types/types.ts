import { ReactNode } from "react";

export type InfiniteTypes = {
  direction: "top" | "bottom";
};

export type InfiniteCore<Data> = {
  selKey: (d: Data) => string; // 무한 스크롤 내에서 유일성을 보장할 key 값을 뽑는 함수
  getItems: (key: string | number) => void; // 무한 스크롤에서 개별 아이템을 그리게 될때 쓰이는 아이템 데이터 리스트
  maxRenderCount: number; // 그릴 아이템 갯수
  pageRenderCount: number;
  items: Data[]; // 전체 데이터, 외부에서 관리하는 경우 직접 넘겨 받기
  preloadMargin?: `${number}px` | number
  scrollElement: Element
};

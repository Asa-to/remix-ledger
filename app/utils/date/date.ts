import dayjs from "dayjs";
/**
 * 実行環境によるタイムゾーンのずれを修正するために現在時刻はこれで取得する
 * @returns 現在時刻
 */
export const getNow = () => {
  return dayjs(new Date()).toDate();
};

import dayjs from "dayjs";
import "dayjs/plugin/timezone";
/**
 * 実行環境によるタイムゾーンのずれを修正するために現在時刻はこれで取得する
 * @returns 現在時刻
 */
export const getNow = () => {
  return dayjs.tz(new Date()).toDate();
};

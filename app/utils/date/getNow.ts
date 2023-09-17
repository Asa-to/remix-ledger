import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * サーバーのタイムゾーンに左右されないdateオブジェクトを返す
 * @returns date
 */
export const getNow = () => {
  return dayjs(new Date()).tz("Asia/Tokyo").toDate();
};

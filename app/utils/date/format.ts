import dayjs from "dayjs";

type DateFormat = "YYYY年MM月DD日" | "DD日";
export const formatDateTime = (date: Date, format: DateFormat) => {
  return dayjs(date).format(format);
};

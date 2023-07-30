/**
 * monthDifferenceに1が入れば翌月の、-1が入れば先月のdateオブジェクトを返します
 * @param date
 * @param monthDifference
 * @returns
 */
export const getDateByMonthDifference = (
  date: Date,
  monthDifference: number
) => {
  // 与えられたDateオブジェクトの年と月を取得
  const year = date.getFullYear();
  const month = date.getMonth();

  // 指定された月数だけ年と月を調整
  const newMonth = month + monthDifference;

  // 年と月を調整して新しいDateオブジェクトを作成
  const newDate = new Date(year, newMonth, 1);

  return newDate;
};

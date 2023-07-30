export const getLastDayOfMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = new Date(year, month + 1, 0);

  return lastDay;
};

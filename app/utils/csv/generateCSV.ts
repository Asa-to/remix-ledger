export const generateCSV = <
  T extends { [key: string]: string | number | null | Date }[]
>(
  data: T
) => {
  const keys = data ? Object.keys(data[0]) : ["N/A"];
  const csvContent =
    "data:text/csv;charset=utf-8," +
    keys.join(",") +
    "\n" +
    data.map((row) => Object.values(row).join(",")).join("\n");

  return csvContent;
};

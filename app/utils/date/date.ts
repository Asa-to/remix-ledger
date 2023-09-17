/**
 * 実行環境によるタイムゾーンのずれを修正するために現在時刻はこれで取得する
 * @returns 現在時刻
 */
export const getNow = () => {
  return new Date(
    Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
  );
};

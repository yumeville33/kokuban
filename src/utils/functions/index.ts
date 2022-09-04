export const keyGenerator = (num: number) => {
  return Math.trunc(
    Number(`${num}${Date.now() + Math.random() * 100000}`)
  ).toString();
};

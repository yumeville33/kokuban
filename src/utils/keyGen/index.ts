const keyGen = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${year}${
    month.toString().length === 1 ? `0${month}` : month
  }${day}-${hour}${minute}${second}`;
};

export default keyGen;

export const reduceAddress = (str, from, end)=> {
    if (!str) { return str; }
    if (str.length <= from + end) {
      return str;
    }
  
    return str
      ? str.substring(0, from) + "..." + str.substring(str.length - end)
      : "-";
  };
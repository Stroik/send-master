export const formatDate = (date: Date) => {
  const _date = new Date(date);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  const day = formatNumber(_date.getUTCDate());
  const month = formatNumber(_date.getUTCMonth() + 1);
  const year = _date.getUTCFullYear();
  const hours = formatNumber(_date.getUTCHours());
  const minutes = formatNumber(_date.getUTCMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

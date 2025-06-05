export const transformDateTime = (
  dateStr,
  onlyTime = false,
  fullDateTime = false
) => {
  //If it's today – only show HH:MM
  //If it’s this week – show weekday name (вт, ср, etc)
  //If it’s this year – show MM.DD (month-day)
  //Otherwise – show MM.DD.YYYY
  const date = new Date(dateStr);
  const now = new Date();

  const weekdaysRu = [
    "вс", // 0 (Sunday)
    "пн", // 1
    "вт", // 2
    "ср", // 3
    "чт", // 4
    "пт", // 5
    "сб", // 6
  ];

  // Helper to format numbers with leading zero
  function pad(num) {
    return num.toString().padStart(2, "0");
  }

  // Always return HH:MM if the flag is true
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  if (onlyTime) {
    return `${hours}:${minutes}`;
  }

  // If full datetime is requested
  if (fullDateTime) {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    return `${year}.${month}.${day}-${hours}:${minutes}`;
  }

  // Check if same day
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return `${hours}:${minutes}`;
  }

  // Get Monday of the current week
  function getMonday(d) {
    const temp = new Date(d);
    const day = temp.getDay();
    const diff = day === 0 ? 6 : day - 1;
    temp.setDate(temp.getDate() - diff);
    return new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());
  }

  const startOfThisWeek = getMonday(now);
  const endOfThisWeek = new Date(startOfThisWeek);
  endOfThisWeek.setDate(endOfThisWeek.getDate() + 7);

  const isSameWeek = date >= startOfThisWeek && date < endOfThisWeek;
  if (isSameWeek) {
    return weekdaysRu[date.getDay()];
  }

  // Check if same year
  const isSameYear = date.getFullYear() === now.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  if (isSameYear) {
    return `${month}.${day}`;
  }

  // Otherwise, return MM.DD.YYYY
  const year = date.getFullYear();
  return `${month}.${day}.${year}`;
};

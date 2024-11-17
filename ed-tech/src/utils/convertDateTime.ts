export function convertDate(isoDate: string): string {
  // Create a Date object from the ISO date string
  const date = new Date(isoDate);

  // Extract the month, date, and year components
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();

  // Format the date as "Month Date, Year"
  return `${month} ${day}, ${year}`;
}

export function convertDurationToHours(durationInSeconds: number) {
  // Convert the duration to hours
  const durationInHours = durationInSeconds / 3600;

  // Round the hours to the nearest whole number
  const roundedHours = Math.max(1, Math.round(durationInHours));

  // Display the result in "X hours" format
  const hours = `${roundedHours} ${roundedHours === 1 ? "hour" : "hours"}`;

  return hours;
}

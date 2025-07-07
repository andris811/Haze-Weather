export function formatTime(unixUtc: number, offsetInSeconds: number) {
  const localTimestamp = (unixUtc + offsetInSeconds) * 1000;
  const localDate = new Date(localTimestamp);

  // Format without applying browser's timezone again
  return localDate.toISOString().substring(11, 16); // "HH:mm"
}

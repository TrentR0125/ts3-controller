/**
 * Convert a Date object to milliseconds since UNIX epoch
 * @param date - The date to convert
 * @returns The number of milliseconds since January 1, 1970
 */
export async function dateToMs(date: Date): Promise<number> {
    return date.getTime(); // getTime() returns milliseconds
}

/**
 * Convert a Date object to seconds since UNIX epoch
 * @param date - The date to convert
 * @returns The number of seconds since January 1, 1970
 */
export async function dateToSeconds(date: Date): Promise<number> {
    return Math.floor(date.getTime() / 1000); // divide milliseconds by 1000
}

/**
 * Format the duration between two Date objects into a human-readable string
 * @param from - The starting date
 * @param to - The ending date
 * @returns A formatted string like "1 Year, 2 Months, 3 days, 4 hours, 5 minutes, 6 seconds"
 */
export async function formatDuration(from: Date, to: Date): Promise<string> {
    // Total difference in seconds
    let delta = Math.floor((to.getTime() - from.getTime()) / 1000);

    // Calculate years
    const years = Math.floor(delta / (365 * 24 * 60 * 60));
    delta -= years * 365 * 24 * 60 * 60;

    // Calculate months (approximate 30 days per month)
    const months = Math.floor(delta / (30 * 24 * 60 * 60));
    delta -= months * 30 * 24 * 60 * 60;

    // Calculate days
    const days = Math.floor(delta / (24 * 60 * 60));
    delta -= days * 24 * 60 * 60;

    // Calculate hours
    const hours = Math.floor(delta / 3600);
    delta -= hours * 3600;

    // Calculate minutes
    const minutes = Math.floor(delta / 60);

    // Remaining seconds
    const seconds = delta % 60;

    // Array to hold each time component as a string
    const parts: string[] = [];

    // Only include units that are non-zero
    if (years) parts.push(`${years} Year${years > 1 ? 's' : ''}`);
    if (months) parts.push(`${months} Month${months > 1 ? 's' : ''}`);
    if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (seconds) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

    // Join all parts into a comma-separated string
    return parts.join(', ');
}

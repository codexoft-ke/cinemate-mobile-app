/**
 * Get the year from a date
 */
export function getYear(date: Date | string): number {
    const d = new Date(date);
    return d.getFullYear();
}

/**
 * Get the month from a date (0-11)
 */
export function getMonth(date: Date | string): number {
    const d = new Date(date);
    return d.getMonth();
}

/**
 * Get the month from a date (1-12)
 */
export function getMonthNumber(date: Date | string): number {
    const d = new Date(date);
    return d.getMonth() + 1;
}

/**
 * Get the day of month from a date (1-31)
 */
export function getDay(date: Date | string): number {
    const d = new Date(date);
    return d.getDate();
}

/**
 * Get the day of week from a date (0-6, where 0 is Sunday)
 */
export function getDayOfWeek(date: Date | string): number {
    const d = new Date(date);
    return d.getDay();
}

/**
 * Get the hours from a date (0-23)
 */
export function getHours(date: Date | string): number {
    const d = new Date(date);
    return d.getHours();
}

/**
 * Get the minutes from a date (0-59)
 */
export function getMinutes(date: Date | string): number {
    const d = new Date(date);
    return d.getMinutes();
}

/**
 * Get the seconds from a date (0-59)
 */
export function getSeconds(date: Date | string): number {
    const d = new Date(date);
    return d.getSeconds();
}

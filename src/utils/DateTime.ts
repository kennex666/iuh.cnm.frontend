function padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
}

export function formatDate(value: number, dateSeparator: string = '/'): string {
    const date = new Date(value);
    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}${dateSeparator}${month}${dateSeparator}${year}`;
}

export function formatTime(value: number, timeSeparator: string = ':'): string {
    const date = new Date(value);
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());
    return `${hours}${timeSeparator}${minutes}${timeSeparator}${seconds}`;
}

export function formatDateTime(
    value: number,
    dateSeparator: string = '/',
    timeSeparator: string = ':'
): string {
    return `${formatDate(value, dateSeparator)} ${formatTime(value, timeSeparator)}`;
}

export function formatDateString(value: string, dateSeparator: string = '/'): string {
    const date = new Date(value);
    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}${dateSeparator}${month}${dateSeparator}${year}`;
}

export function formatTimeString(value: string, timeSeparator: string = ':'): string {
    const date = new Date(value);
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());
    return `${hours}${timeSeparator}${minutes}${timeSeparator}${seconds}`;
}

export function formatDateTimeString(
    value: string,
    dateSeparator: string = '/',
    timeSeparator: string = ':'
): string {
    return `${formatDateString(value, dateSeparator)} ${formatTimeString(value, timeSeparator)}`;
}

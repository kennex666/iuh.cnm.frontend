function padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
}

function validateAndConvert(value: string | number | Date): Date {
    if (value === null || value === undefined)
        throw new Error('Date value cannot be null or undefined');

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime()))
        throw new Error('Invalid date value');

    return date;
}

export function formatDate(value: string | number | Date, dateSeparator: string = '/'): string {
    try {
        const date = validateAndConvert(value);
        const day = padZero(date.getDate());
        const month = padZero(date.getMonth() + 1);
        const year = date.getFullYear();
        return `${day}${dateSeparator}${month}${dateSeparator}${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
}

export function formatTime(value: string | number | Date, timeSeparator: string = ':'): string {
    try {
        const date = validateAndConvert(value);
        const hours = padZero(date.getHours());
        const minutes = padZero(date.getMinutes());
        const seconds = padZero(date.getSeconds());
        return `${hours}${timeSeparator}${minutes}${timeSeparator}${seconds}`;
    } catch (error) {
        console.error('Error formatting time:', error);
        return 'Invalid time';
    }
}

export function formatDateTime(
    value: string | number | Date,
    dateSeparator: string = '/',
    timeSeparator: string = ':'
): string {
    return `${formatDate(value, dateSeparator)} ${formatTime(value, timeSeparator)}`;
}

export function formatRelativeTime(value: string | number | Date): string {
    try {
        const date = validateAndConvert(value);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'Vừa xong';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} phút trước`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} giờ trước`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ngày trước`;
        } else {
            return formatDate(date);
        }
    } catch (error) {
        console.error('Error formatting relative time:', error);
        return 'Invalid date';
    }
}

export function compareDate(date1: string | number | Date, date2: string | number | Date): number {
    try {
        const d1 = validateAndConvert(date1);
        const d2 = validateAndConvert(date2);

        const time1 = d1.getTime();
        const time2 = d2.getTime();

        if (time1 < time2) return -1;
        if (time1 > time2) return 1;
        return 0;
    } catch (error) {
        console.error('Error comparing dates:', error);
        return 0;
    }
}
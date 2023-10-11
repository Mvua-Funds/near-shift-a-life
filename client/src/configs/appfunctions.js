

export const getTheme = (theme) => {
    return theme.colorScheme === "dark"
}

export const getTimezone = (date) => {
    if (date) {
        let d = new Date(date);
        let timeZone = d?.toString().match(/\(([A-Za-z\s].*)\)/)[1];
        return timeZone
    }
    return ""
}

export const limitText = (text, limit) => {
    if (text.length >= limit) {
        return text.substring(0, limit)
    }
    return text
}
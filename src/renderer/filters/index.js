

export function humanTime(value) {
    let res = "";
    value = parseInt(value);
    if (isNaN(value)) {
        return "00:00";
    }
    res +=
        Math.floor(value / 60) < 10
            ? "0" + Math.floor(value / 60)
            : Math.floor(value / 60);
    res += ":";
    res +=
        Math.floor(value % 60) < 10
            ? "0" + Math.floor(value % 60)
            : Math.floor(value % 60);

    return res;
}
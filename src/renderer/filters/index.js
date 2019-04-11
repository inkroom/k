

export function humanTime(value) {
    let res = "";
    value = parseInt(value);
    if (isNaN(value)) {
        return "00:00";
    }
    res +=
        parseInt(value / 60) < 10
            ? "0" + parseInt(value / 60)
            : parseInt(value / 60);
    res += ":";
    res +=
        parseInt(value % 60) < 10
            ? "0" + parseInt(value % 60)
            : parseInt(value % 60);

    return res;
}
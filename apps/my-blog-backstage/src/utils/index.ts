/**
 * 时间补0
 * @param num 添加0的数字
 * @returns 补0后的数字
 */
const addZero = (num: number) => {
    return num < 10 ? `0${num}` : num
}
/**
 * 获取当前时间并格式化
 * @returns 格式化后的时间
 */
const formatDate = () => {
    const now = new Date(); // 获取当前时间

    const year = now.getFullYear(); // 获取年份
    const month = now.getMonth() + 1; // 获取月份（注意：getMonth() 返回的月份是 0 到 11，因此需要 +1）
    const day = now.getDate(); // 获取日期
    const hours = now.getHours(); // 获取小时
    const minutes = now.getMinutes(); // 获取分钟
    const seconds = now.getSeconds(); // 获取秒钟

    // 将月份、日期、小时、分钟和秒数转换为两位数（例如 09, 04）
    return `${year}-${addZero(month)}-${addZero(day)} ${addZero(hours)}:${addZero(minutes)}:${addZero(seconds)}`;
}
const checkIfInstanceOf = function (obj: any, classFunction: any) {
    if (obj === null || obj === undefined || !(classFunction instanceof Function))
        return false;
    return Object(obj) instanceof classFunction;
}

export {
    addZero,
    formatDate,
    checkIfInstanceOf,
}
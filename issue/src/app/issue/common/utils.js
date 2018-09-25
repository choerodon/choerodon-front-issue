
/**
 * 生成指定长度的随机字符串
 * @param len 字符串长度
 * @returns {string}
 */
export function randomString(len = 32) {
  let code = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxPos = chars.length;
  for (let i = 0; i < len; i += 1) {
    code += chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
  }
  return code;
}

/**
 * 根据key从sessionStorage取值
 * @param key
 */
export function getSessionStorage(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

/**
 * 设置或更新sessionStorage
 * @param key
 * @param item
 */
export function setSessionStorage(key, item) {
  return sessionStorage.setItem(key, JSON.stringify(item));
}

/**
 * 根据key从sessionStorage删除
 * @param key
 */
export function removeSessionStorage(key) {
  return sessionStorage.removeItem(key);
}

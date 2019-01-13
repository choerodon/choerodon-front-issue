
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

/**
 * 动态计算名称宽度
 * @param val
 * @returns {number}
 */
export function getByteLen(val) {
  let len = 0;
  for (let i = 0; i < val.length; i += 1) {
    const a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/ig) !== null) { // \x00-\xff→GBK双字节编码范围
      len += 15;
    } else {
      len += 10;
    }
  }
  return len;
}

/**
 * 解析url
 * @param url
 * @returns {{}}
 */
export function getRequest(url) {
  const theRequest = {};
  if (url.indexOf('?') !== -1) {
    const str = url.split('?')[1];
    const strs = str.split('&');
    for (let i = 0; i < strs.length; i += 1) {
      theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
    }
  }
  return theRequest;
}

exports.setCookie = (cookieName, cookieValue, expiryDays = 365) => {
  let expiryTime;

  if (expiryDays < 0) {
    expiryTime = "Thu, 01 Jan 1970 00:00:00 UTC";
  } else {
    let d = new Date();
    d.setTime(d.getTime() + expiryDays * 24 * 60 * 60 * 1000);
    expiryTime = d.toUTCString();
  }

  document.cookie = `${cookieName}=${cookieValue}; expires=${expiryTime}; path=/;`;
};

exports.getCookie = (cookieName) => {
  let cookieArr = decodeURIComponent(document.cookie).split(";");

  let cookie = cookieArr.find((cooki) => {
    if (/\s/.test(cooki[0])) {
      cooki = cooki.slice(1);
    }
    return cooki.slice(0, cookieName.length) === cookieName;
  });

  return cookie ? cookie.split("=")[1] : null;
};

exports.alphanumerise = (str) => {
  return str
    .split("")
    .filter((char) => /[a-z0-9_]/i.test(char))
    .join("");
};

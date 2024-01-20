export const writeToken = (token: any, name = 'token') =>
  localStorage.setItem(name, JSON.stringify(token));

export const writeUser = (user: any) =>
  localStorage.setItem('user', JSON.stringify(user));

export const readToken = (name = 'token') => {
  const token = localStorage.getItem(name);
  return token ? JSON.parse(token) : null;
};

export const readUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeToken = () => localStorage.removeItem('token');
export const removeUser = () => localStorage.removeItem('user');

export const initialsNameLetters = (name: any) =>
  name
    ? name
        .split(' ')
        .map((n: any) => n.charAt(0))
        .join('')
    : '';

export const toSnakeCase = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item));
  }

  return Object.keys(obj).reduce((acc: any, key) => {
    const snakeCaseKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    acc[snakeCaseKey] = toSnakeCase(obj[key]);
    return acc;
  }, {});
};

export const toCamelCase = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  }

  return Object.keys(obj).reduce((acc: any, key) => {
    const camelCaseKey = key.replace(/(_\w)/g, (k) => k[1].toUpperCase());
    acc[camelCaseKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};

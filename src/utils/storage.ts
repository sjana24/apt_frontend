// Storage utility to handle both localStorage and sessionStorage

const getStorage = () => {
  const rememberMe = localStorage.getItem("rememberMe") === "true";
  return rememberMe ? localStorage : sessionStorage;
};

export const storage = {
  setItem: (key: string, value: string, remember: boolean = false) => {
    const storageType = remember ? localStorage : sessionStorage;
    storageType.setItem(key, value);
    if (remember) {
      localStorage.setItem("rememberMe", "true");
    }
  },

  getItem: (key: string): string | null => {
    // Check localStorage first if rememberMe is enabled
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    if (rememberMe) {
      return localStorage.getItem(key);
    }
    // Otherwise check sessionStorage
    return sessionStorage.getItem(key);
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },

  clear: () => {
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullname");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.clear();
  },
};

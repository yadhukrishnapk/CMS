// LocalStorage utility functions
export const loadData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return null;
  }
};

export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    return false;
  }
};

export const removeData = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data from localStorage:', error);
    return false;
  }
};

// IndexedDB utility for media storage (optional)
export const saveMediaToIndexedDB = async (file) => {
  try {
    const { set } = await import('idb-keyval');
    const arrayBuffer = await file.arrayBuffer();
    await set(file.name, arrayBuffer);
    return true;
  } catch (error) {
    console.error('Error saving media to IndexedDB:', error);
    return false;
  }
};

export const loadMediaFromIndexedDB = async (filename) => {
  try {
    const { get } = await import('idb-keyval');
    const arrayBuffer = await get(filename);
    if (arrayBuffer) {
      const blob = new Blob([arrayBuffer]);
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error('Error loading media from IndexedDB:', error);
    return null;
  }
};

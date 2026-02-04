
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, update, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBKEi7HbtAn70_BETeFL_qcz0RhCqOUvAg",
  authDomain: "yura-baf5b.firebaseapp.com",
  databaseURL: "https://yura-baf5b-default-rtdb.firebaseio.com",
  projectId: "yura-baf5b",
  storageBucket: "yura-baf5b.firebasestorage.app",
  messagingSenderId: "1047766653772",
  appId: "1:1047766653772:web:1db2d3c9c1bbe930818de9",
  measurementId: "G-02FPWWME51"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

class CloudDB {
  private static instance: CloudDB;
  private constructor() {}
  public static getInstance(): CloudDB {
    if (!CloudDB.instance) CloudDB.instance = new CloudDB();
    return CloudDB.instance;
  }

  // Работа с контентом обучения (CMS)
  async saveContent(days: any[]) {
    try {
      const contentRef = ref(database, 'content');
      await set(contentRef, days);
      return true;
    } catch (e) {
      console.error("Content Save Error:", e);
      return false;
    }
  }

  subscribeToContent(callback: (days: any[] | null) => void) {
    const contentRef = ref(database, 'content');
    return onValue(contentRef, (snapshot) => {
      callback(snapshot.val());
    });
  }

  // Регистрация нового сотрудника
  async registerUser(name: string, password: string) {
    const userKey = name.replace(/\s+/g, '_').toLowerCase();
    const userRef = ref(database, `auth_users/${userKey}`);
    
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      throw new Error("Сотрудник с таким ФИО уже зарегистрирован");
    }

    const userData = {
      name,
      password,
      createdAt: { ".sv": "timestamp" }
    };

    await set(userRef, userData);
    
    const profileRef = ref(database, `users/${userKey}`);
    await set(profileRef, {
      name,
      isAdmin: false,
      completedDays: [],
      lastActive: { ".sv": "timestamp" }
    });

    return { name, isAdmin: false, completedDays: [] };
  }

  async loginUser(name: string, password: string) {
    const userKey = name.replace(/\s+/g, '_').toLowerCase();
    const authRef = ref(database, `auth_users/${userKey}`);
    
    const authSnapshot = await get(authRef);
    if (!authSnapshot.exists()) {
      throw new Error("Пользователь не найден. Пожалуйста, зарегистрируйтесь.");
    }

    const authData = authSnapshot.val();
    if (authData.password !== password) {
      throw new Error("Неверный пароль");
    }

    // Получаем актуальный прогресс
    const profileRef = ref(database, `users/${userKey}`);
    const profileSnapshot = await get(profileRef);
    let completedDays = [];
    let isAdmin = false;
    
    if (profileSnapshot.exists()) {
      const profileData = profileSnapshot.val();
      completedDays = profileData.completedDays || [];
      isAdmin = profileData.isAdmin || false;
    }

    return { name: authData.name, isAdmin, completedDays };
  }

  // Получение актуальных данных пользователя для автологина
  async fetchUserProfile(name: string) {
    const userKey = name.replace(/\s+/g, '_').toLowerCase();
    const profileRef = ref(database, `users/${userKey}`);
    const snapshot = await get(profileRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  }

  async saveCompletion(record: any) {
    try {
      const statsRef = ref(database, 'stats');
      const newStatRef = push(statsRef);
      await set(newStatRef, {
        ...record,
        serverTimestamp: { ".sv": "timestamp" } 
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  subscribeToStats(callback: (stats: any[]) => void) {
    const statsRef = ref(database, 'stats');
    return onValue(statsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const statsList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        callback(statsList);
      } else callback([]);
    });
  }

  async syncUser(user: any) {
    if (!user.userName) return;
    try {
      const userKey = user.userName.replace(/\s+/g, '_').toLowerCase();
      const userRef = ref(database, `users/${userKey}`);
      
      await update(userRef, {
        name: user.userName,
        isAdmin: user.isAdmin,
        completedDays: user.completedDays || [],
        completedCount: (user.completedDays || []).length,
        lastActive: { ".sv": "timestamp" }
      });
    } catch (e) { console.error("Sync Error:", e); }
  }
}

export const db = CloudDB.getInstance();

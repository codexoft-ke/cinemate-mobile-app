import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = {
    getItem: async (key: string): Promise<string | null> => {
        return await AsyncStorage.getItem(key);
    },
    setItem: async (key: string, value: string): Promise<void> => {
        return await AsyncStorage.setItem(key, value);
    },
    deleteItem: async (key: string): Promise<void> => {
        return await AsyncStorage.removeItem(key);
    },
    clearItems: async (): Promise<void> => {
        return await AsyncStorage.clear();
    },
}



export default useStore;
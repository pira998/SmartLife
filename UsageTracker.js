import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to track screen usage time
export const trackScreenUsage = async () => {
    const currentTime = new Date();
    const prevTime = await AsyncStorage.getItem('prevTime');

    if (prevTime) {
        const duration = currentTime - new Date(prevTime);
        const usageTime = await AsyncStorage.getItem('usageTime');
        const totalUsageTime = parseInt(usageTime) + Math.floor(duration / 1000);
        await AsyncStorage.setItem('usageTime', totalUsageTime.toString());
    }

    await AsyncStorage.setItem('prevTime', currentTime.toString());
}

// Function to retrieve total screen usage time
export const getTotalUsageTime = async () => {
    const usageTime = await AsyncStorage.getItem('usageTime');
    return parseInt(usageTime);
}

// Function to reset screen usage time
export const resetUsageTime = async () => {
    await AsyncStorage.removeItem('usageTime');
    await AsyncStorage.removeItem('prevTime');
}

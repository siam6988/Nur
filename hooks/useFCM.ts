import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { messaging, db } from '../firebase-config';
import { useStore } from '../context/StoreContext';

export function useFCM() {
  const { user, showToast } = useStore();

  useEffect(() => {
    const requestPermission = async () => {
      if (!messaging) return;
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // get token
          const token = await getToken(messaging, {
            // Note: Replace with your actual VAPID key if you have one
            // vapidKey: 'YOUR_VAPID_KEY'
          });
          
          if (token && user?.id && db) {
            // Save token to user profile
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, {
              fcmToken: token,
              updatedAt: new Date().toISOString()
            });
            console.log('FCM Token saved successfully');
          }
        }
      } catch (error) {
        console.error('Error requesting notification permission or getting token:', error);
      }
    };

    if (user?.id) {
      requestPermission();
    }

    if (messaging) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received in foreground: ', payload);
        const title = payload.notification?.title || 'New Notification';
        showToast(title, 'success');
      });

      return () => unsubscribe();
    }
  }, [user?.id, showToast]);
}

importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDSYALT_jaIQrTq-oZP9sMyUJWXaLSjTY4",
  authDomain: "nur-shop-siam.firebaseapp.com",
  projectId: "nur-shop-siam",
  storageBucket: "nur-shop-siam.firebasestorage.app",
  messagingSenderId: "536596371721",
  appId: "1:536596371721:web:454f879521237e61211bd8"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

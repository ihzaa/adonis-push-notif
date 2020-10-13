// pub : BNI7p_9nFWcVklOD3pIdDo9gWeNnhRXowMM18vYimRYhYn1cV-zOm7NYRpUVVFs2i52xFL0Ic9ZOmdiOk6dsd44
// priv: Xvyw9RUf32h1Blt9GmGRPcFhPgMzf_9GOxLiW-g990o
// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
// saveSubscription saves the subscription to the backend
const saveSubscription = async (subscription) => {
  const SERVER_URL = "/subscribe/save-subscription";
  const response = await fetch(SERVER_URL, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
};
self.addEventListener("activate", async () => {
  // This will be called only once when the service worker is activated.
  try {
    const applicationServerKey = urlB64ToUint8Array(
      "BNI7p_9nFWcVklOD3pIdDo9gWeNnhRXowMM18vYimRYhYn1cV-zOm7NYRpUVVFs2i52xFL0Ic9ZOmdiOk6dsd44"
    );
    const options = { applicationServerKey, userVisibleOnly: true };
    const subscription = await self.registration.pushManager.subscribe(options);
    const response = await saveSubscription(subscription);
    showLocalNotification(
      "Subscribe Berahsil",
      {
        body: "Anda akan menerima notifikasi",
        data: { url: "/" },
      },
      self.registration
    );
  } catch (err) {
    console.log("Error", err);
  }
});
self.addEventListener("push", function (event) {
  if (event.data) {
    showLocalNotification(
      "Ini Push Notif",
      JSON.parse(event.data.text()),
      self.registration
    );
  } else {
    console.log("Push event but no data");
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (clients.openWindow && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

const showLocalNotification = (title, body, swRegistration) => {
  swRegistration.showNotification(title, body);
};

import SubscriberData from "./idb-helper.js";

let b = 100;

const check = () => {
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
};
const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register("js/sw.js");
  return swRegistration;
  // const worker = new Worker('/js/sw.js', { type: 'module' });
};
const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }
};
const main = async () => {
  SubscriberData.putSubscriber({ id: 1, ket: "sudah", tgl: Date.now() });
  check();
  const permission = await requestNotificationPermission();
  const swRegistration = await registerServiceWorker();
  await location.reload();
};

const unsub = () => {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
  SubscriberData.deleteSubscriber(1);
  alert("berhasil unsubscribe");
  location.reload();
};

const init = async () => {
  const cek = await SubscriberData.getAll();

  if (cek.length != 0) {
    $("#isi_main").html(`
  <button class="btn btn-lg btn-danger" id="btn_unsub">Unsubscribe</button>
  <h1 class="ml-5">Subscribe pada : ${moment(cek[0].tgl).format(
    "DD-MM-YYYY hh:mm:ss"
  )}</h1>
  `);
    $(document).on("click", "#btn_unsub", unsub);
  } else {
    $("#isi_main").html(
      '<button class="btn btn-lg btn-primary" id="btn_subscribe">Subscribe</button>'
    );
    $(document).on("click", "#btn_subscribe", main);
  }
};

init();

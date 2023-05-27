export default function swDev() {
  if ("serviceWorker" in navigator) {
    let swUrl = `./serviceWorker.js`;
    navigator.serviceWorker.register(swUrl).then((response) => {
      console.warn(`response : `, response);
    });
  } else {
    console.log("Service Workers not supported");
  }
}

export function sendDataToWorker(data) {
  navigator.serviceWorker.controller.postMessage(data);
}

/** @format */

self.addEventListener("install", () => {
  console.log("Service worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated", event);
});

let orderIdQueue = [];
// let orderIdQueue = {};
// let head = 0;
// let tail = 0;

// function enqueue(item) {
//   orderIdQueue[tail] = item;
//   tail++;
// }

// function dequeue() {
//   let item = orderIdQueue[head];
//   delete orderIdQueue[head];
//   head++;
//   return item;
// }
let currentSize = orderIdQueue.length;

function enqueue(newOrderId) {
  orderIdQueue[currentSize] = newOrderId;
  currentSize++;
}

function dequeue() {
  if (currentSize > 0) {
    for (let i = 0; i < orderIdQueue.length; i++) {
      orderIdQueue[i] = orderIdQueue[i + 1];
    }
    currentSize--;
    orderIdQueue.length = currentSize;
  }
}

function sendOrderId(url, orderId) {
  console.log(orderId);
  return fetch(url);
}

self.addEventListener("message", (event) => {
  let { type, orderId } = event.data;
  console.log(type);
  if (type === "FETCH_ORDER_ID") {
    enqueue(orderId);
    self.registration.sync.register(orderId);
  }
  if (type === "DELETE_ORDER_ID") {
    dequeue();
  }
  console.log(orderIdQueue);
});
let rightUrl = "https://jsonplaceholder.typicode.com/users";
let errorUrl = "https://jsonplaceholder.typicode.com/users";
self.addEventListener("sync", (event) => {
  event.waitUntil(
    sendOrderId(errorUrl, event.tag)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => {
        console.log(err);
        setTimeout(() => {
          sendOrderId(rightUrl, event.tag)
            .then((res) => res.json())
            .then((data) => console.log(data));
        }, 2000);
      })
  );
});

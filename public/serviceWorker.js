const DB_NAME = "paymentRecord";
const DB_VERSION = 1;
const DB_STORE_NAME = "orderIds";

function createDB() {
  let request = indexedDB.open(DB_NAME, DB_VERSION);
  console.log("Install indexDB");
  request.onerror = function (error) {
    console.log("Error in indexDB", error);
  };
  request.onupgradeneeded = function (event) {
    let dbResult = event.target.result;
    if (dbResult.objectStoreNames.contains(DB_STORE_NAME)) {
      dbResult.deleteObjectStore(DB_STORE_NAME);
    }
    let store = dbResult.createObjectStore(DB_STORE_NAME, {
      // keyPath: "id",
      autoIncrement: true,
    });
    store.createIndex("id", "id", { unique: true });
  };
}

self.addEventListener("install", () => {
  createDB();
  console.log("Service worker installed");
});

self.addEventListener("activate", (event) => {
  let openDBRequest = indexedDB.open(DB_NAME);
  openDBRequest.onsuccess = (event) => {
    console.log("DB opened from service worker");
    let db = event.target.result;
    const transaction = db.transaction([DB_STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(DB_STORE_NAME);
    let request = objectStore.getAll();
    console.log(request);
  };

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


self.addEventListener("message", (event) => {
  let { type, orderId } = event.data;
  if (type === "FETCH_ORDER_ID") {
    enqueue(orderId);
    self.registration.sync.register(orderId);
  }
  if (type === "DELETE_ORDER_ID") {
    dequeue();
  }
});


self.addEventListener("sync", (event) => {
  console.log(event.target);
  let openDBRequest = indexedDB.open(DB_NAME);

  openDBRequest.onsuccess = (event) => {
    console.log("DB opened from service worker");

    let db = event.target.result;
    const transaction = db.transaction([DB_STORE_NAME], "readwrite");

    const objectStore = transaction.objectStore(DB_STORE_NAME);
    objectStore.add(orderIdQueue);
  };
});

let db;

const request = indexedDB.open("budget_tracker", 1);
request.onupgradeneeded = (ev) => {
  db = ev.target.result;
  db.createObjectStore("pending-transactions", { autoIncrement: true });
};

request.onsuccess = (ev) => {
  db = ev.target.result;
  // if navigator.online
};
//saves the the transaction when offline
function saveRecord(record) {
  const transaction = db.transaction(["pending-transactions"], "readwrite");
  transaction.objectStore("pending-transactions").add(record);
}
//read the indexDB if something in there then add it.
function upload() {
  const transaction = db.transaction(["pending-transactions"], "readwrite");
  const store = transaction.objectStore("pending-transactions");
  const records = store.getAll(); //
  records.onsuccess = () => {
    if (records.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(records.result),
      })
        .then((j) => j.json())
        .then((res) => {
          const transaction = db.transaction(
            ["pending-transactions"],
            "readwrite"
          );
          const store = transaction.objectStore("pending-transactions");
          store.clear();
        });
    }
  };
}
window.addEventListener("online", upload);

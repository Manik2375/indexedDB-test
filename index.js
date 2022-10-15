"use strict";

const openRequest = indexedDB.open("videos", 1);

openRequest.addEventListener("upgradeneeded", function (event) {
	let db = openRequest.result;
	if (!db.objectStoreNames.contains("video")) {
		db.createObjectStore("video", { autoIncrement: true });
	}
});

let dataBase;
openRequest.addEventListener("success", () => {
	dataBase = openRequest.result;

	let transaction = dataBase.transaction("video", "readonly");
	let objStore = transaction.objectStore("video");

	const data = objStore.get(1);
	data.addEventListener("success", () => {
		if (data.result) {
			showVid(data.result);
		} else {
			addVidToDatabase();
		}
	});
});

async function addVidToDatabase() {
	const res = await fetch("./vid.mp4");
	const blob = await res.blob();

	let transaction = dataBase.transaction("video", "readwrite");
	let objStore = transaction.objectStore("video");
	objStore.add(blob);

	showVid(blob);
}

function showVid(vid) {
	document.getElementById("video").src = URL.createObjectURL(vid);
}

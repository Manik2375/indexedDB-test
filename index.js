"use strict";

const page = "home";
const openRequest = indexedDB.open("videos", 1);

openRequest.addEventListener("upgradeneeded", function (event) {
	let db = openRequest.result;
	if (!db.objectStoreNames.contains("video")) {
		db.createObjectStore("video", { keyPath: "page" });
	}
});

let dataBase;
openRequest.addEventListener("success", () => {
	dataBase = openRequest.result;

	let transaction = dataBase.transaction("video", "readonly");
	let objStore = transaction.objectStore("video");

	const data = objStore.get(page);
	data.addEventListener("success", () => {
		if (data.result) {
			showVid(data.result.blob);
		} else {
			addVidToDatabase();
		}
	});

	dataBase.addEventListener("error", function (event) {
		let request = event.target;

		console.log("Error", request.error);
	});
});

async function addVidToDatabase() {
	const res = await fetch("./vid.mp4");
	const blob = await res.blob();

	const obj = {
		blob,
		page,
	};

	let transaction = dataBase.transaction("video", "readwrite");
	let objStore = transaction.objectStore("video");
	objStore.add(obj);

	showVid(blob);
}

function showVid(vid) {
	document.getElementById("video").src = URL.createObjectURL(vid);
}

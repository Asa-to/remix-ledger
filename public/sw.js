const le = true;
if (le) console.log("Service Worker Start");

self.addEventListener("install", function (event) {
  if (le) console.log("Service Worker Install", event);
});

self.addEventListener("activate", function (event) {
  if (le) console.log("Service Worker Activate", event);
});

if (le) console.log("Service Worker End");

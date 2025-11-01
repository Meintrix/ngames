function play(choice) {
  fetch("/play_rps", {
    method: "POST",
    body: new URLSearchParams({ choice }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("output").innerText =
        کامپیوتر: ${data.computer} | نتیجه: ${data.result};
    });
}
function play(choice) {
  fetch("/play_rps", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "choice=" + encodeURIComponent(choice)
  })
  .then(function (res) {
    if (!res.ok) throw new Error("Server error");
    return res.json();
  })
  .then(function (data) {
    var output = document.getElementById("output");
    output.innerText = "کامپیوتر: " + data.computer + " | نتیجه: " + data.result;
  })
  .catch(function (err) {
    var output = document.getElementById("output");
    output.innerText = "خطا در ارتباط با سرور ⚠️";
    console.error(err);
  });
}
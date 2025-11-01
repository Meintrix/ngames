function sendGuess() {
  const guess = document.getElementById("guess").value;
  fetch("/check_guess", {
    method: "POST",
    body: new URLSearchParams({ guess }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("result").innerText = data.result;
    });
}
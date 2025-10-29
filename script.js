// Minor lint fixes and attach handler to the demo button
console.log("Welcome to the Bad UI showcase");

function showMessage() {
  alert("This is just a demo of a poor UI example!");
}

document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("show-btn");
  if (btn) {
    btn.addEventListener("click", showMessage);
  }
});

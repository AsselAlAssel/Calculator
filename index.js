// variable :noune
// function :verb

const domElement = {
    body: document.querySelector("body"),
    container: document.getElementsByClassName("container"),
    themeContainer: document.querySelector(".container__theme-btns-container"),
    sunBtn: document.querySelector(".sun"),
    moonBtn: document.querySelector(".moon"),
    equationContainer: document.querySelector(".container__show-equation"),
    resultContainer: document.querySelector(".container__show-result"),
    btnsContainer: document.querySelector(".container__btns-container"),
    btn: document.querySelectorAll(".container__btns-container .btn")
}
const toggleTheme = () => domElement.body.classList.toggle("dark-them")

    domElement.sunBtn.addEventListener("click", () => toggleTheme());
domElement.moonBtn.addEventListener("click", () => toggleTheme());

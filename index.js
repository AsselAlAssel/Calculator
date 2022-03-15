let sunBtn = document.querySelector(".btn-sun"),
    moonBtn = document.querySelector(".btn-moon"),
    container = document.querySelector(".container"),
    btnDark = document.querySelector(".dark-button"),
    showEquation = document.querySelector(".show-equation"),
    showResult = document.querySelector(".show-result"),
    btnsContainer = document.querySelector(".btns-container"),
    btn = document.querySelectorAll(".btn");



const toggleDark = (obj) => {

    obj.classList.toggle("dark");

};
const toggleDarkForBtns = (args) => {
    args.forEach(item => {
        toggleDark(item);
    })

};
const toggleDarkForAll = (...args) => {
    args.forEach(item => {
        toggleDark(item);
    })
}
const startDark = () => {
    sunBtn.classList.toggle("sun");
    moonBtn.classList.toggle("moon");
    toggleDarkForBtns(btn);
    toggleDarkForAll(container, btnDark, showEquation, showResult, btnsContainer);
};



sunBtn.addEventListener("click", () => startDark());
moonBtn.addEventListener("click", () => startDark());

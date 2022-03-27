const domElements = {
    body: document.querySelector("body"),
    container: document.getElementsByClassName("container"),
    themeContainer: document.querySelector(".container__theme-btns-container"),
    sunBtn: document.querySelector(".sun"),
    moonBtn: document.querySelector(".moon"),
    equationContainer: document.querySelector(".container__show-equation"),
    resultContainer: document.querySelector(".container__show-result"),
    btnsContainer: document.querySelector(".container__btns-container"),
    btn: document.querySelectorAll(".container__btns-container .btn")
};
const toggleTheme = () => domElements.body.classList.toggle("dark-them");
domElements.sunBtn.addEventListener("click", () => toggleTheme());
domElements.moonBtn.addEventListener("click", () => toggleTheme());

// *************************

const initialState = {
    firstVal: "",
    secondVal: "",
    operation: "",
}
Object.freeze(initialState);
let state = { ...initialState };
const hasZeroLen = (value) => value.length === 0;
const showContent = (content, container) => container.innerText = content;
const reMount = () => {
    const equation = hasZeroLen(state.operation) ? "0" : state.firstVal + state.operation;
    const res = hasZeroLen(state.operation) ? state.firstVal : state.secondVal;
    showContent(equation, domElements.equationContainer);
    showContent(res || "0", domElements.resultContainer);
}
const setState = (value) => {
    state = { ...state, ...value };
    console.log(state);
    reMount();
};
const resetState = () => {
    setState(initialState);
}
const resetFirstValue = () => {
    setState({ firstVal: "" });
}
const resetSecondValue = () => {
    setState({ secondVal: "" });
}
const deleteStepFirstValue = () => {
    setState({ firstVal: state.firstVal.slice(0, state.firstVal.length - 1) });
}
const deleteStepSecondValue = () => {
    setState({ secondVal: state.secondVal.slice(0, state.secondVal.length - 1) });
}
const toggleSignFirstValue = () => {
    setState({ firstVal: (+state.firstVal) * -1 + "" });
}
const toggleSignSecondValue = () => {
    setState({ secondVal: (+state.secondVal) * -1 + "" });
}
const hasDot = (value, numberPressed) => numberPressed === "." && value.includes(".");
const isLengthLessThan13 = (value) => value.length < 13;

const addToFirstValue = (numberPressed) => {
    if (hasDot(state.firstVal, numberPressed)) {
        return;
    }
    const newFirstValue = state.firstVal + numberPressed;
    if (isLengthLessThan13(newFirstValue)) {
        setState({ firstVal: newFirstValue });
    }
}
const addToSecondValue = (numberPressed) => {
    if (hasDot(state.secondVal, numberPressed)) {
        return;
    }
    const newSecondValue = state.secondVal + numberPressed;
    if (isLengthLessThan13(newSecondValue)) {
        setState({ secondVal: newSecondValue });
    }
}
const findClickedNumber = (targeted) => {
    const numberPressed = targeted.dataset.value;
    if (hasZeroLen(state.operation)) {
        addToFirstValue(numberPressed);
        return;
    }
    addToSecondValue(numberPressed);
}
const sum = (firstVal, secondVal) => firstVal + secondVal;
const minus = (firstVal, secondVal) => firstVal - secondVal;
const multiply = (firstVal, secondVal) => firstVal * secondVal;
const divide = (firstVal, secondVal) => secondVal !== 0 ? firstVal / secondVal : NaN;
const solveTheEquationByCallback = (callback) => {

    let resFromEquation = callback(+state.firstVal, +state.secondVal);
    if (isNaN(resFromEquation)) {
        resetState();
        showContent("cant divide by 0", domElements.resultContainer);
        return;
    }
    if ((resFromEquation + "").includes(".")) {
        resFromEquation = resFromEquation.toFixed(2);
    }
    setState({ firstVal: resFromEquation, secondVal: "", operation: "" });
}
const solveTheEquation = () => {
    switch (state.operation) {
        case "+":
            return solveTheEquationByCallback(sum);

        case "-":
            return solveTheEquationByCallback(minus);

        case "*":
            return solveTheEquationByCallback(multiply);

        case "/":
            return solveTheEquationByCallback(divide);
    }
}
const findOperationMathClicked = (operationTextValue) => {
    const pressOperationWithNoSecondValue = hasZeroLen(state.secondVal) && operationTextValue !== "=";
    const pressEqualWithSecondValue = !hasZeroLen(state.secondVal) && operationTextValue === "=";
    if (pressOperationWithNoSecondValue) {
        setState({ operation: operationTextValue });
        return;
    }
    if (pressEqualWithSecondValue) {
        solveTheEquation();
        return;
    }
    solveTheEquation();
    if (!hasZeroLen(state.firstVal)) {
        console.log(4);
        setState({ operation: operationTextValue });
    }
}


const findClickedOperation = (targeted) => {
    const operationTextValue = targeted.dataset.value;
// Ca
// عشان اذا طبع ايرور يقدر يكبس على الكبسه يفضي كلشي بالشاشه او بامكانه يكبس عرقم ههههههه 
    if (hasZeroLen(state.firstVal) && operationTextValue !== "CA") {
        return;
    }
    const DoseOperationEmpty = hasZeroLen(state.operation);
    switch (operationTextValue) {
        case "CA":
            return resetState();
        case "C":
            return DoseOperationEmpty ? resetFirstValue() : resetSecondValue();
        case "delete-step":
            return DoseOperationEmpty ? deleteStepFirstValue() : deleteStepSecondValue();
        case "+/-":
            return DoseOperationEmpty ? toggleSignFirstValue() : toggleSignSecondValue();
        default:
            return findOperationMathClicked(operationTextValue);

    }
}
const whatBtnClicked = (targeted) => {
    let type = targeted.dataset.type;
    switch (type) {
        case "operation":
            return findClickedOperation(targeted);
        case "number":
            return findClickedNumber(targeted);
    }
}
const btnClicked = (targeted, state) => targeted.tagName === "BUTTON" ? whatBtnClicked(targeted, state) : state;
domElements.btnsContainer.addEventListener("click", (event) => btnClicked(event.target, state));







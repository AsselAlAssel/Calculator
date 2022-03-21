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
}
const toggleTheme = () => domElements.body.classList.toggle("dark-them")

domElements.sunBtn.addEventListener("click", () => toggleTheme());
domElements.moonBtn.addEventListener("click", () => toggleTheme());

// *************************
const initialState = {
    res: "",
    firstVal: "",
    secondVal: "",
    operation: "",
}
Object.freeze(initialState);
let state = { ...initialState };
// const setState = (state, value) => { return { ...state, ...value } };

const setState = (value) => {
    state = { ...state, ...value };
};
// **********************************

const showContent = (content, container) => container.innerText = content;

const hasZeroLen = (value) => value.length === 0;

const resetState = (initialState) => {
    showContent("0", domElements.equationContainer);
    showContent("0", domElements.resultContainer);
    setState(initialState);
}

const cleanInput = (property) => {
    showContent("0", domElements.resultContainer);
    setState({ [`${property}`]: "" });
}
const deleteStep = (property) => {
    setState({ [`${property}`]: state[`${property}`].slice(0, state[`${property}`].length - 1) });
    showContent(state[`${property}`] || "0", domElements.resultContainer);
}
const toggleSign = (property) => {
    setState({ [`${property}`]: +(state[`${property}`]) * -1 + "" });
    showContent(state[`${property}`], domElements.resultContainer);

}
const addNumberToState = (prevValue, valueEntered, property) => {
    if (valueEntered === "." && prevValue.includes(".")) {
        return;
    }
    setState({ [`${property}`]: prevValue + valueEntered });
    showContent(state[`${property}`], domElements.resultContainer);
}
const numberClicked = (targeted) => {
    let valueEntered = targeted.dataset.value;
    hasZeroLen(state.operation) ? addNumberToState(state.firstVal, valueEntered, "firstVal") :
        addNumberToState(state.secondVal, valueEntered, "secondVal");

}
const sum = (firstVal, secondVal) => firstVal + secondVal;
const minus = (firstVal, secondVal) => firstVal - secondVal;
const multiply = (firstVal, secondVal) => firstVal * secondVal;
const divide = (firstVal, secondVal) => secondVal !== 0 ? firstVal / secondVal : NaN;

const doTheEquationByCallback = (callback) => {
    let resFromEquation = callback(+state.firstVal, +state.secondVal);
    if (isNaN(resFromEquation)) {
        setState({ res: "wrong input", firstVal: "", secondVal: "", operation: "" });
    } else if (resFromEquation > 99999999.99) {
        setState({ res: "the result than 10 digit ", firstVal: "", secondVal: "", operation: "" });
    } else {
        if (resFromEquation - parseInt(resFromEquation) > 0) {
            resFromEquation = resFromEquation.toFixed(2);
        }
        setState({ res: resFromEquation, firstVal: resFromEquation, secondVal: "", operation: "" });
    }
}
const doTheEquation = () => {
    switch (state.operation) {
        case "+":
            doTheEquationByCallback(sum);
            break;
        case "-":
            doTheEquationByCallback(minus);
            break;
        case "*":
            doTheEquationByCallback(multiply);
            break;
        case "/":
            doTheEquationByCallback(divide);
            break;
    }
}
const operationMathClicked = (operationValue) => {
    if (hasZeroLen(state.operation) && operationValue !== "=") {
        showContent(`${state.firstVal} ${operationValue}`, domElements.equationContainer);
        showContent("0", domElements.resultContainer);
        setState({ operation: operationValue });
    } else {
        if (hasZeroLen(state.secondVal) && operationValue === "=") {
            return;
        }
        else if (hasZeroLen(state.secondVal) && operationValue !== "=") {
            showContent(`${state.firstVal} ${operationValue}`, domElements.equationContainer);
            setState({ operation: operationValue });
        } else {
            doTheEquation();
            if (operationValue === "=") {
                showContent("0", domElements.equationContainer);
                showContent(state.res, domElements.resultContainer);
            } else {
                showContent(`${state.res} ${operationValue}`, domElements.equationContainer);
                showContent("0", domElements.resultContainer);
                setState({ operation: operationValue });
            }
        }
    }
}
const operationClicked = (targeted) => {
    if (hasZeroLen(state.firstVal) && targeted.dataset.value !== "CA") {
        return;
    }
    let operationValue = targeted.dataset.value;
    switch (operationValue) {
        case "CA":
            resetState(initialState);
            break;
        case "C":
            hasZeroLen(state.operation) ? cleanInput("firstVal") : cleanInput("secondVal");
            break;
        case "delete-step":
            hasZeroLen(state.operation) ? deleteStep("firstVal") : deleteStep("secondVal");
            break;
        case "+/-":
            hasZeroLen(state.operation) ? toggleSign("firstVal") : toggleSign("secondVal");
            break;
        default:
            operationMathClicked(operationValue);
            break;
    }
}
const whatBtnClicked = (targeted) => {
    let type = targeted.dataset.type;
    switch (type) {
        case "operation":
            operationClicked(targeted);
            break;
        case "number":
            numberClicked(targeted);
            break;
    }
}
const btnClicked = (targeted, state) => targeted.tagName === "BUTTON" ? whatBtnClicked(targeted, state) : state;
domElements.btnsContainer.addEventListener("click", (event) => btnClicked(event.target, state));







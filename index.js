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

const hasZeroLen = (value) => value.length === 0;
const showContent = (content, container) => container.innerText = content;

const reMount = () => {
    let equation = hasZeroLen(state.operation) ? "0" : state.firstVal + state.operation;
    showContent(equation, domElements.equationContainer);
    showContent(state.res || "0", domElements.resultContainer);
}
const setState = (value) => {
    state = { ...state, ...value };
    console.log(state);
    reMount();
};

const resetState = () => {
    setState(initialState);
}
const resetInput = () => {
    setState({ res: "" });
}
const deleteStep = () => {
    setState({ res: state.res.slice(0, state.res.length - 1) });
}
const toggleSign = () => {
    setState({ res: (+state.res) * -1 + "" });
}

const numberClicked = (targeted) => {
    let numberPressed = targeted.dataset.value,
        prevValue = state.res;
    if (numberPressed === "." && prevValue.includes(".")) {
        return;
    }
    setState({ res: prevValue + numberPressed });
}
const sum = (firstVal, secondVal) => firstVal + secondVal;
const minus = (firstVal, secondVal) => firstVal - secondVal;
const multiply = (firstVal, secondVal) => firstVal * secondVal;
const divide = (firstVal, secondVal) => secondVal !== 0 ? firstVal / secondVal : NaN;

const solveTheEquationByCallback = (callback) => {
    let resFromEquation = callback(+state.firstVal, +state.secondVal);
    if (isNaN(resFromEquation)) {
        resetState();
        showContent("wrong input", domElements.resultContainer);
        return;
    }
    if (resFromEquation > 99999999.99) {
        resetState();
        showContent("more than 10 digit", domElements.resultContainer);
        return;

    }
    if (Math.abs(resFromEquation) - parseInt(Math.abs(resFromEquation)) > 0) {
        resFromEquation = resFromEquation.toFixed(2);

    }
    setState({ res: resFromEquation, firstVal: "", secondVal: "", operation: "" });
}

const solveTheEquation = () => {
    switch (state.operation) {
        case "+":
            solveTheEquationByCallback(sum);
            break;
        case "-":
            solveTheEquationByCallback(minus);
            break;
        case "*":
            solveTheEquationByCallback(multiply);
            break;
        case "/":
            solveTheEquationByCallback(divide);
            break;
    }
}

const operationMathClicked = (operationTextValue) => {
    let pressEqualWithNoSecondValue = (!hasZeroLen(state.firstVal)
        && hasZeroLen(state.res) &&
        operationTextValue === "="),
        pressMathOperationWithNoFirstValue = (hasZeroLen(state.firstVal)
            && operationTextValue !== "="),
        pressMathOperationWithNoSecondValue = (hasZeroLen(state.res)
            && !hasZeroLen(state.firstVal) &&
            operationTextValue !== "="),
        pressEqualWithSecondValue = (!hasZeroLen(state.res)
            && !hasZeroLen(state.firstVal) &&
            operationTextValue === "=");

    if (pressMathOperationWithNoFirstValue) {
        setState({ res: "", firstVal: state.res, operation: operationTextValue });
        return;
    }
    if (pressEqualWithNoSecondValue) {
        return;
    }
    if (pressMathOperationWithNoSecondValue) {
        console.log(2);
        setState({ operation: operationTextValue });
        return;
    }
    if (pressEqualWithSecondValue) {
        console.log(3);
        setState({ secondVal: state.res });
        solveTheEquation();
        return;
    }

    console.log(4);
    setState({ secondVal: state.res });
    solveTheEquation();
    setState({ res: "", firstVal: state.res, operation: operationTextValue });
}

const operationClicked = (targeted) => {
    let preventOperationBeforeEnterAnyValue = (hasZeroLen(state.res) &&
        hasZeroLen(state.firstVal) &&
        targeted.dataset.value !== "CA");

    if (preventOperationBeforeEnterAnyValue) {
        return;
    }
    let operationTextValue = targeted.dataset.value;
    switch (operationTextValue) {
        case "CA":
            resetState();
            break;
        case "C":
            resetInput();
            break;
        case "delete-step":
            deleteStep();
            break;
        case "+/-":
            toggleSign()
            break;
        default:
            operationMathClicked(operationTextValue);
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







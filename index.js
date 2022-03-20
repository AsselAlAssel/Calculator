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

// *************************
const initialState = {
    res: "",
    firstVal: "",
    secondVal: "",
    operation: "",
}

Object.freeze(initialState);
let state = { ...initialState };
const setState = (state, value) => { return { ...state, ...value } };
// **********************************

const showContent = (content, container) => container.innerText = content;

const hasZeroLen = (value) => value.length === 0;

const cleanState = (state, initialState) => {
    showContent("0", domElement.equationContainer);
    showContent("0", domElement.resultContainer);
    return setState(state, initialState);
}

const cleanInput = (state, property) => {
    showContent("0", domElement.resultContainer);
    return setState(state, { [`${property}`]: "" });
}
const deleteStep = (state, property) => {
    state = setState(state, { [`${property}`]: state[`${property}`].slice(0, state[`${property}`].length - 1) });
    showContent(state[`${property}`] || "0", domElement.resultContainer);
    return state;
}
const toggleSign = (state, property) => {
    state = setState(state, { [`${property}`]: +(state[`${property}`]) * -1 + "" });
    showContent(state[`${property}`], domElement.resultContainer);
    return state;
}

const addNumberToState = (state, prevValue, valueEntered, property) => {
    if (valueEntered === "." && prevValue.includes(".")) {
        return state;
    }
    showContent(prevValue + valueEntered, domElement.resultContainer);
    return setState(state, { [`${property}`]: prevValue + valueEntered });
}
const numberClicked = (targeted, state) => {
    let valueEntered = targeted.dataset.value;
    return hasZeroLen(state.operation) ? addNumberToState(state, state.firstVal, valueEntered, "firstVal") :
        addNumberToState(state, state.secondVal, valueEntered, "secondVal");

}
const sum = (firstVal, secondVal) => firstVal + secondVal;
const minus = (firstVal, secondVal) => firstVal - secondVal;
const multiply = (firstVal, secondVal) => firstVal * secondVal;
const divide = (firstVal, secondVal) => { return secondVal !== 0 ? firstVal / secondVal : NaN };

const doTheEquationByCallback = (state, callback) => {
    let resFromEquation = callback(+state.firstVal, +state.secondVal);
    if (isNaN(resFromEquation)) {
        return setState(state, { res: "cant divide by 0", firstVal: "", secondVal: "", operation: "" });
    } else if (resFromEquation > 99999999.99) {
        return setState(state, { res: "the result than 10 digit ", firstVal: "", secondVal: "", operation: "" });
    } else {
        if (resFromEquation - parseInt(resFromEquation) > 0) {
            resFromEquation = resFromEquation.toFixed(2);
        }
        return setState(state, { res: resFromEquation, firstVal: resFromEquation, secondVal: "", operation: "" });
    }


}
const doTheEquation = (state) => {
    switch (state.operation) {
        case "+":
            return doTheEquationByCallback(state, sum);
        case "-":
            return doTheEquationByCallback(state, minus);
        case "*":
            return doTheEquationByCallback(state, multiply);
        case "/":
            return doTheEquationByCallback(state, divide);
    }
}
const operationMathClicked = (state, operationValue) => {
    if (hasZeroLen(state.operation) && operationValue !== "=") {
        showContent(`${state.firstVal} ${operationValue}`, domElement.equationContainer);
        showContent("0", domElement.resultContainer);
        return setState(state, { operation: operationValue });
    } else {
        if (hasZeroLen(state.secondVal) && operationValue === "=") {
            return state;
        }
        else if (hasZeroLen(state.secondVal) && operationValue !== "=") {
            showContent(`${state.firstVal} ${operationValue}`, domElement.equationContainer);
            return setState(state, { operation: operationValue });
        } else {
            state = doTheEquation(state);
            if (operationValue === "=") {
                showContent("0", domElement.equationContainer);
                showContent(state.res, domElement.resultContainer);
                return state;
            } else {
                showContent(`${state.res} ${operationValue}`, domElement.equationContainer);
                showContent("0", domElement.resultContainer);
                return setState(state, { operation: operationValue });
            }
        }
    }
}
const operationClicked = (targeted, state) => {
    if (hasZeroLen(state.firstVal) && targeted.dataset.value !== "CA") {
        return state;
    }
    let operationValue = targeted.dataset.value;
    switch (operationValue) {
        case "CA":
            return cleanState(state, initialState);
        case "C":
            return hasZeroLen(state.operation) ? cleanInput(state, "firstVal") : cleanInput(state, "secondVal");
        case "delete-step":
            return hasZeroLen(state.operation) ? deleteStep(state, "firstVal") : deleteStep(state, "secondVal");
        case "+/-":
            return hasZeroLen(state.operation) ? toggleSign(state, "firstVal") : toggleSign(state, "secondVal");
        default:
            return operationMathClicked(state, operationValue);
    }
}
const whatBtnClicked = (targeted, state) => {
    let type = targeted.dataset.type;
    switch (type) {
        case "operation":
            return operationClicked(targeted, state);
        case "number":
            return numberClicked(targeted, state);
    }
}
const btnClicked = (targeted, state) => targeted.tagName === "BUTTON" ? whatBtnClicked(targeted, state) : state;

domElement.btnsContainer.addEventListener("click", (event) => state = btnClicked(event.target, state));







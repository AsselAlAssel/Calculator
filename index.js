let root = document.querySelector(":root"),
    body = document.querySelector("body"),
    sunBtn = document.querySelector(".sun"),
    moonBtn = document.querySelector(".moon"),
    container = document.getElementsByClassName("container"),
    btnDark = document.querySelector(".container__theme-btns-container"),
    showEquation = document.querySelector(".container__show-equation"),
    showResult = document.querySelector(".container__show-result"),
    btnsContainer = document.querySelector(".container__btns-container"),
    btn = document.querySelectorAll(".container__btns-container .btn"),
    res = "",
    firstVal = "",
    secondVal = "",
    equation = "",
    operation = "",
    cssVariables = ['--background-color-container', '--color-showEquation'
        , '--color-showResult', '--background-color-themContainer',
        '--corl-moonBtn', '--background-color-btnsContainer', '--background-color-btn',
        '--color-numberBtn'
    ],
    darkThemeColor = ['#22252d', '#fff', '#fff', '#292d36', '#fff', '#292d36', '#272b33', '#fff'],
    ligthThemeColor = ['#fff', 'rgb(133, 127, 127)', '#000', '#f9f9f9', '#b8b8b8', '#f9f9f9', '#f7f7f7', '#000'];



const doTheTheme = (vaiable, value, root) => root.style.setProperty(vaiable, value);
const toggleTheme = (root, body, cssVariables, darkThemeColor, ligthThemeColor) => {

    if (!(body.dataset.theme)) {
        cssVariables.forEach((ele, index) => doTheTheme(ele, darkThemeColor[index], root))

        body.dataset.theme = "dark";
    } else {
        cssVariables.forEach((ele, index) => doTheTheme(ele, ligthThemeColor[index], root))
        delete body.dataset.theme;
    }


}

sunBtn.addEventListener("click", () => toggleTheme(root, body, cssVariables, darkThemeColor, ligthThemeColor));
moonBtn.addEventListener("click", () => toggleTheme(root, body, cssVariables, darkThemeColor, ligthThemeColor))
// **********************************
const cleanAll = () => {
    res = "";
    equation = "";
    operation = "";
    firstVal = "";
    secondVal = "";
    display(0, showResult);
    display(0, showEquation)
}
const textOfBtnClicked = targeted => targeted.innerHTML;
const display = (text, position) => position.innerHTML = text;

const isEqualTo0 = val => val === 0;
const toggleAsign = val => {
    if (val[0] === "-") {
        return val.substring(1);
    }
    return "-" + val;
}
const sum = (firstVal, secondVal) => firstVal + secondVal;
const minus = (firstVal, secondVal) => firstVal - secondVal;
const multiply = (firstVal, secondVal) => firstVal * secondVal;
const divide = (firstVal, secondVal) => secondVal === 0 ? "Error" : firstVal / secondVal;
const doTheEquation = (firstVal, secondVal, operation) => {
    let text = 0;
    switch (operation) {

        case '+':
            text = sum(+firstVal, +secondVal);
            break;
        case '-':
            text = minus(+firstVal, +secondVal);
            break;
        case '*':
            text = multiply(+firstVal, +secondVal);
            break;
        case '/':
            text = divide(+firstVal, +secondVal);
            break;


    }

    return text;
}

const whatClicked = (targeted, tagName, className) => {

    if (className.includes("number")) {
        let text = textOfBtnClicked(targeted);
        if (text !== ".") {
            res += text;
        } else {
            if (!res.includes(text)) {
                res += text;

            }
        }
        display(res, showResult);
        return;

    } else if (className.includes("clean-all")) {
        cleanAll();

    }
    else if (className.includes("clean-step")) {
        res = res.substring(0, res.length - 1);
        if (isEqualTo0(res.length)) {
            display(0, showResult);
            return;
        }
        display(res, showResult);

    } else if (className.includes("clean")) {
        res = "";
        display(0, showResult);
    }
    else if (className.includes("operation")) {
        let text = textOfBtnClicked(targeted);

        if (text === "+/-" && !isEqualTo0(res.length)) {

            if (!isEqualTo0(res.length)) {
                res = toggleAsign(res);
                display(res, showResult);
                return;
            }

        } else if (text === "=") {
            if (!isEqualTo0(firstVal.length) && (!isEqualTo0(res.length))) {
                secondVal = res;
                res = doTheEquation(firstVal, secondVal, operation);
                if (typeof res === "string") {
                    cleanAll();
                    display("Error", showResult);
                    return;
                } else {
                    if ((res - parseInt(res) + "").length > 4) {

                        res = res.toFixed(2);
                    }
                    if (("" + res.length > 10)) {
                        cleanAll();
                        display("ore than 10 digit", showResult);
                        return;
                    }
                }
                equation = "";
                firstVal = res;
                secondVal = ""
                operation = "";
                display("0", showEquation);
                display(res, showResult);
                res = "";
                return;
            }

        } else {
            if (isEqualTo0(firstVal.length) && !isEqualTo0(res.length)) {
                firstVal = res;
                operation = text;
                equation += res + operation;
                res = ""
                display(equation, showEquation);
                return;
            } else if ((!isEqualTo0(firstVal.length) && !isEqualTo0(res.length))) {
                secondVal = res;
                res = doTheEquation(firstVal, secondVal, operation);
                if (typeof res === "string") {
                    cleanAll();
                    display("Error", showResult);
                    return;
                } else {
                    if ((res - parseInt(res) + "").length > 4) {

                        res = res.toFixed(2);
                    }
                    if (("" + res.length > 10)) {
                        cleanAll();
                        display("ore than 10 digit", showResult);
                        return;
                    }
                }
                equation = res + text;
                firstVal = res;
                secondVal = "";
                operation = text;
                display(res, showResult);
                res = "";
                display(equation, showEquation);
                return;

            } else if ((!isEqualTo0(firstVal.length) && isEqualTo0(equation.length))) {
                if (text !== "+") {
                    equation = firstVal + text;
                    operation = text;
                    display(equation, showEquation);
                    res = "";
                }
            }

        }
    }


}
const onclickBtn = (eve) => {
    let targeted = eve.target,
        tagName = targeted.tagName,
        className = targeted.className;
    whatClicked(targeted, tagName, className);

}
btnsContainer.addEventListener("click", (eve) => onclickBtn(eve))





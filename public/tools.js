let optionsCont = document.querySelector(".options-cont");
let optionsFlag = true;
let toolsCont = document.querySelector(".tools-cont");
let pencil = document.querySelector(".pencil");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let pencilFlag = false;
let eraser = document.querySelector(".eraser");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let eraserFlag = false;
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let body = document.querySelector("body");

body.addEventListener("click", function (e) {
    // hide pencil and eraser tools when clicked outside of them
    if (!(e.target.parentElement.classList.contains("tools-cont") || e.target.parentElement.parentElement.classList.contains("tools-cont"))) {
        pencilFlag = false;
        // eraserFlag = false;
        pencilToolCont.style.display = "none";
        eraserToolCont.style.display = "none";
    }
});

optionsCont.addEventListener("click", function (e) {
    optionsFlag = !optionsFlag;
    let iconElem = optionsCont.children[0];
    if (optionsFlag) {
        iconElem.classList.remove("fa-bars");
        iconElem.classList.add("fa-times");
        toolsCont.style.display = "flex";
        toolsCont.style.animation = "scale-tools 500ms";
        // openTools();
    } else {
        iconElem.classList.remove("fa-times");
        iconElem.classList.add("fa-bars");
        pencilToolCont.style.display = "none";
        pencilFlag = false;
        eraserToolCont.style.display = "none";
        eraserFlag = false;
        toolsCont.style.animation = "scale-tools-reverse 500ms";
        setTimeout(() => {
            toolsCont.style.display = "none";
        }, 490);
        // closeTools();
    }
})

pencil.addEventListener("click", function (e) {
    // hide eraser tool if it is open
    eraserFlag = false;
    eraserToolCont.style.display = "none";
    pencilFlag = !pencilFlag;
    // true -> show pencil tool, false -> hide pencil tool
    if (pencilFlag) {
        pencilToolCont.style.display = "flex";
    } else {
        pencilToolCont.style.display = "none";
    }
})

eraser.addEventListener("click", function (e) {
    // hide pencil tool if it is open
    pencilFlag = false;
    pencilToolCont.style.display = "none";
    eraserFlag = !eraserFlag;
    // true -> show eraser tool, false -> hide eraser tool
    if (eraserFlag) {
        eraserToolCont.style.display = "flex";
    } else {
        eraserToolCont.style.display = "none";
    }
})

upload.addEventListener("click", function (e) {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.addEventListener("change", function (e) {
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        let stickyTemplateHTML = `
        <div draggable="true" class="header-cont">
            <div class="fa-solid min-max minimize"></div>
            <div class="fa-solid remove"></div>
        </div>
        <div draggable="true" class="note-cont">
            <img src="${url}" alt="sticky-img"/>
        </div>
        `;
        createSticky(stickyTemplateHTML);
    })

})

sticky.addEventListener("click", function (e) {
    let stickyTemplateHTML = `
    <div draggable="true" class="header-cont">
        <div class="fa-solid min-max minimize"></div>
        <div class="fa-solid remove"></div>
    </div>
    <div draggable="true" class="note-cont">
        <textarea draggable="true" spellcheck="false"></textarea>
    </div>
    `;
    createSticky(stickyTemplateHTML);
})

function createSticky(stickyTemplateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.classList.add("sticky-cont");
    stickyCont.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyCont);
    stickyCont.style.animation = "appear 400ms";

    // minimize, maximize and remove functionality
    let maximizeFlag = false;
    let minMax = stickyCont.querySelector(".min-max");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minMax, remove, stickyCont, maximizeFlag);

    // drap n drop functionality
    dragNdrop2(stickyCont);
}

function noteActions(minMax, remove, stickyCont, maximizeFlag) {
    minMax.addEventListener("mouseover", function (e) {
        displayMinMaxIcon(maximizeFlag, minMax);
    })
    minMax.addEventListener("mouseout", function (e) {
        minMax.classList.remove("fa-minus");
        minMax.classList.remove("fa-up-right-and-down-left-from-center");
        minMax.style.boxShadow = "none";
    })
    minMax.addEventListener("click", function (e) {
        maximizeFlag = !maximizeFlag;
        if (maximizeFlag) {
            minMax.classList.remove("minimize");
            minMax.classList.add("maximize");
            stickyCont.style.animation = "minimize 500ms";
            setTimeout(() => {
                stickyCont.style.height = "2rem";
            }, 490);
        }
        else {
            minMax.classList.remove("maximize");
            minMax.classList.add("minimize");
            stickyCont.style.animation = "maximize 500ms";
            setTimeout(() => {
                stickyCont.style.height = "13rem";
            }, 490);
        }
    })

    remove.addEventListener("mouseover", function (e) {
        remove.classList.add("fa-times");
    })
    remove.addEventListener("mouseout", function (e) {
        remove.classList.remove("fa-times");
    })
    remove.addEventListener("click", function (e) {
        stickyCont.style.animation = "remove 400ms";
        setTimeout(() => {
            stickyCont.remove();
        }, 290);
    })
}

function displayMinMaxIcon(flag, elem) {
    if (flag) {
        elem.classList.remove("fa-minus");
        elem.classList.add("fa-up-right-and-down-left-from-center");
    }
    else {
        elem.classList.remove("fa-up-right-and-down-left-from-center");
        elem.classList.add("fa-minus");
    }
}

function dragNdrop(elem) {  // didn't use because can't handle more than 1 elements properly
    elem.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    function mouseUp() {
        window.removeEventListener('mousemove', move, true);
    }

    function mouseDown(e) {
        window.addEventListener('mousemove', move, true);
    }

    function move(e) {
        elem.style.top = e.clientY + 'px';
        elem.style.left = e.clientX + 'px';
    };

    elem.ondragstart = function () {
        return false;
    }
}

function dragNdrop2(elem) {
    var mousePosition;
    var offset = [0, 0];
    var isDown = false;

    elem.style.position = "absolute"; // without it, movement is glitchy.

    // elem.style.left = "0px";
    // elem.style.top = "0px";


    elem.addEventListener('mousedown', function (e) {
        isDown = true;
        offset = [
            elem.offsetLeft - e.clientX,
            elem.offsetTop - e.clientY
        ];
    }, true);

    document.addEventListener('mouseup', function () {
        isDown = false;
    }, true);

    document.addEventListener('mousemove', function (event) {
        event.preventDefault();
        if (isDown) {
            mousePosition = {

                x: event.clientX,
                y: event.clientY

            };
            elem.style.left = (mousePosition.x + offset[0]) + 'px';
            elem.style.top = (mousePosition.y + offset[1]) + 'px';
        }
    }, true);
}
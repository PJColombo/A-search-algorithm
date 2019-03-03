const $boardSelector = ".board";
const $generateBtnSelector = ".create-btn";
const $colSizeSelector = ".col-inp";
const $rowSizeSelector = ".row-inp";
const $startRadioSelector = "#start-element";
const $finishRadioSelector = "#finish-element";
const $obstacleRadioSelector = "#obstacle-element";
$(document).ready(() => {
    $($boardSelector).on("click", ".cell", onClickCell);
    $($generateBtnSelector).on("click", onGenerateBoard);
});


function onGenerateBoard() {
    let colSize = $($colSizeSelector).val(),
        rowSize = $($rowSizeSelector).val();
    console.log(colSize, rowSize);
    if(rowSize && colSize && colSize <= 35)  
        generateBoard(rowSize, colSize);
    else if(colSize <= 35)
        alert("El número de columnas debe ser menor a 35.");
    else
        alert("Introduce un tamaño válido del tablero.");
    
}
function generateBoard(rowSize, colSize) {
    console.log("aqui");
    $($boardSelector + " tbody").empty();
    for(let i = 0; i < rowSize; i++) {
        let $newElement = $('<tr></tr>');
        $(".board > tbody").append($newElement);
        for(let j = 0; j < colSize; j++) {
            $($newElement).append("<td class='cell'></td>");
        }

    }
}

function onClickCell() {
    console.log("aqui");
    console.log($($startRadioSelector).is(":selected"));
    
    if($($startRadioSelector).is(":checked")) {
        $(".start").toggleClass("start");
        $(this).toggleClass("start");
    }
    else if($($finishRadioSelector).is(":checked")) {
        $(".finish").toggleClass("finish");
        $(this).toggleClass("finish");
    }
    else if($($obstacleRadioSelector).is(":checked")) {
        if(!$(this).hasClass("start") && !$(this).hasClass("finish"))
            $(this).toggleClass("blocked");
        else
            alert("No puedes bloquear esta celda.");
    }
}
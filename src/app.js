const $boardSelector = ".board";
const $generateBtnSelector = ".create-btn";
const $executeBtnSelector = ".execute-btn";
const $colSizeSelector = ".col-inp";
const $rowSizeSelector = ".row-inp";
const $startRadioSelector = "#start-element";
const $finishRadioSelector = "#finish-element";
const $obstacleRadioSelector = "#obstacle-element";
const $radioInput = ".radio-btn";

import $ from 'jquery';

import Board from './modules/model';
import AStar from "./modules/aStar";
import "./css/style.css";

let board;
let astar = new AStar("euclidean");

$(document).ready(() => {
    $($boardSelector).on("click", ".cell", onClickCell);
    $($generateBtnSelector).on("click", onGenerateBoard);
    $($executeBtnSelector).on("click", onClickExecute);
    $($radioInput).on("click", onClickRadio);
});

function onGenerateBoard() {
    let colSize = parseInt($($colSizeSelector).val()),
        rowSize = parseInt($($rowSizeSelector).val());
    if(rowSize && colSize && colSize <= 35)  
        generateBoard(rowSize, colSize);
    else if(colSize <= 35) {
        $($colSizeSelector).val(10);
        alert("El número de columnas debe ser menor a 35.");
    }
    else {
        $($colSizeSelector).val(10);
        alert("Introduce un tamaño válido del tablero.");
    }
    
}

function onClickExecute() {
    let path = astar.search(board);
    if(path.length === 0)
        alert("No se ha podido encontrar un camino");
    else
        paintPath(path);
    
}

function paintPath(path) {
    path.forEach((cell, index) => {
        if(index < path.length - 1)
            setTimeout(() => {
                $(`#${cell.key}`).toggleClass("path");
            }, 200 * index);
    })
}
function generateBoard(rowSize, colSize) {    
    board = new Board(rowSize, colSize);
    console.log(board.matrix);

    $($boardSelector + " tbody").empty();
    for(let i = 0; i < rowSize; i++) {
        let $newElement = $('<tr></tr>');
        $(".board > tbody").append($newElement);
        for(let j = 0; j < colSize; j++) {
            $($newElement).append(`<td id=${i}-${j} class='cell'></td>`);
        }

    }
    
}

function onClickCell() {
    let [row, col] = $(this).attr('id').split("-");
    row = parseInt(row); col = parseInt(col);
    
    if($($startRadioSelector).is(":checked")) {
        $(".start").toggleClass("start");
        $(this).toggleClass("start");
        
        board.setStartCell(row, col);
    }
    else if($($finishRadioSelector).is(":checked")) {
        $(".finish").toggleClass("finish");
        $(this).toggleClass("finish");

        board.setFinishCell(row, col);
    }
    else if($($obstacleRadioSelector).is(":checked")) {
        if(!$(this).hasClass("start") && !$(this).hasClass("finish")) {
            $(this).toggleClass("blocked");
            board.setBlockedCell(row, col);
        }
        else
            alert("No puedes bloquear esta celda.");
    }
}

function onClickRadio() {
    $($radioInput).not(":checked").prev().removeClass("active-radio");
    if($(this).is(":checked"))
        $(this).prev().addClass("active-radio");
    
}

const $boardSelector = ".board";
const $generateBtnSelector = ".create-btn";
const $generateRanBtnSelector = ".random-board-btn";
const $executeBtnSelector = ".execute-btn";
const $colSizeSelector = ".col-inp";
const $rowSizeSelector = ".row-inp";
const $startRadioSelector = "#start-element";
const $finishRadioSelector = "#finish-element";
const $obstacleRadioSelector = "#obstacle-element";
const $checkpointRadioSelector = "#checkpoint-element";
const $weightRadioSelector = "#weight-element";
const $radioInput = ".radio-btn";
const $weightInp = "#weight-inp";

import $ from 'jquery';

import Board from './modules/model';
import AStar from "./modules/aStar";
import "./css/style.css";

let board;
let astar = new AStar("euclidean");
let checkpointCounter = 0;
let checkpointSelectors = [];
let checkpointsPos = [];

$(document).ready(() => {
    $($weightInp).toggle();
    $($boardSelector).on("click", ".cell", onClickCell);
    $($generateBtnSelector).on("click", onGenerateBoard);
    $($generateRanBtnSelector).on("click", onGenerateBoard);
    $($executeBtnSelector).on("click", onClickExecute);
    $($radioInput).on("click", onClickRadio);
});

function onGenerateBoard() {
    
    let random = $(this).hasClass($generateRanBtnSelector.substr(1));
    let colSize = parseInt($($colSizeSelector).val()),
        rowSize = parseInt($($rowSizeSelector).val());
    
    if(rowSize && colSize && colSize <= 35)  
        generateBoard(rowSize, colSize, random);
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
    let completePath = [], currPath;
    let alertMsg ="";
    let lastSuccessfulCheckpoint; 
    checkpointsPos.unshift(board.startCell);
    checkpointsPos.push(board.finishCell);
    
    lastSuccessfulCheckpoint = board.startCell;
    for(let i = 0; i < checkpointsPos.length - 1; i++) {
        currPath = [];
        board.startCell = lastSuccessfulCheckpoint;
        board.finishCell = checkpointsPos[i + 1];
        
        
        
        currPath = astar.search(board);
        if(currPath.length === 0) {
            alertMsg += `No se ha podido encontrar un camino al checkpoint ${i + 1} \n`;
        }
        else {
            completePath.push(...currPath);
            lastSuccessfulCheckpoint = checkpointsPos[i + 1];
        }
        board.restart();
        astar.clear();
    }
     
    if(alertMsg)
        alert(alertMsg);   
    if(completePath.length > 0)
        paintPath(completePath);
}

function paintPath(path) {
    path.forEach((cell, index) => {
        if(index < path.length - 1)
            setTimeout(() => {
                $(`#${cell.key}`).addClass("path");
            }, 200 * index);
    })
}

function generateBoard(rowSize, colSize, random) {   
    restart();
    board = new Board(rowSize, colSize, random);
    let cellClass, weight;
    $($boardSelector + " tbody").empty();
    for(let i = 0; i < rowSize; i++) {
        let $newElement = $('<tr></tr>');
        $(".board > tbody").append($newElement);
        for(let j = 0; j < colSize; j++) {
            cellClass = weight = "";
            if (random) {
                if(board.matrix[i][j].blockedCell)
                    cellClass = "blocked";
                else if (board.matrix[i][j].weight > 1) {
                    weight = board.matrix[i][j].weight;
                    cellClass = "weighted";
                }
            }
            $($newElement).append(`<td id=${i}-${j} class='cell ${cellClass}'>${weight}</td>`);
        }

    }
    
}

function onClickCell() {
    let [row, col] = $(this).attr('id').split("-");
    row = parseInt(row); col = parseInt(col);
    /* Starting cell */
    if($($startRadioSelector).is(":checked")) {
        $(".start").toggleClass("start");
        $(this).toggleClass("start");
        
        board.startCell = {row, col};
    }
    /* Ending cell */
    else if($($finishRadioSelector).is(":checked")) {
        $(".finish").toggleClass("finish");
        $(this).toggleClass("finish");

        board.finishCell = {row, col};
    }
    /* Obstacle cell */
    else if($($obstacleRadioSelector).is(":checked")) {
        if(!$(this).hasClass("start") && !$(this).hasClass("finish")) {
            $(this).toggleClass("blocked");
            board.setBlockedCell(row, col);
        }
        else
            alert("No puedes bloquear esta celda.");
    }
    /* Checkpoint cell. */
    else if($($checkpointRadioSelector).is(":checked")) {
        if(!$(this).hasClass("start") && !$(this).hasClass("finish")
            && !$(this).hasClass("blocked") && !$(this).hasClass("weighted")) {
            $(this).toggleClass("checkpoint");
            if($(this).hasClass("checkpoint")) {
                checkpointCounter++;
                $(this).text(checkpointCounter);
                checkpointSelectors.push($(this));
                checkpointsPos.push({row, col});
            }
            else {
                let cpNumber = parseInt($(this).text());
                checkpointCounter--;
                checkpointSelectors.splice(cpNumber - 1, 1);
                checkpointsPos.splice(cpNumber - 1, 1);
                /* Repaint checkpoint positions on board. */
                checkpointSelectors.forEach((selector, index) => {
                    if(index >= cpNumber - 1)
                        selector.text(parseInt(selector.text()) - 1);
                })
                $(this).text("");
            }
        }
        else
            alert("No puedes poner un checkpoint en esta celda. Ya está ocupada");
    }
    /* Weighted cell */
    else if($($weightRadioSelector).is(":checked")) {
        let weight = parseInt($($weightInp).val());
        let currWeight = board.getWeightCell({row, col});
        /* Undo weight cell */
        if(currWeight === weight) {
            board.setWeightCell({row, col, weight: 1});
            $(this).text("");
            $(this).removeClass("weighted");
        } 
        else { 
            $(this).text(weight);
            board.setWeightCell({row, col, weight});
            $(this).addClass("weighted");            
        }
    }
}

function onClickRadio() {
    $($radioInput).not(":checked").prev().removeClass("active-radio");
    if(!$(this).hasClass("weight-radio") && $($weightInp).is(":visible"))
        $($weightInp).toggle("fast");
    if($(this).is(":checked")) {
        if($(this).hasClass("weight-radio")) {
            $($weightInp).toggle("fast");
        }
        else
            $($weightInp).removeClass("active-radio");
        $(this).prev().addClass("active-radio");
    }
    
}
function restart() {
    if(astar)
        astar.clear();
    checkpointCounter = 0;
    checkpointSelectors = [];
    checkpointsPos = [];
}

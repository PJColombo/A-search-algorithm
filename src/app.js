const $boardSelector = ".board";
const $generateBtnSelector = ".create-btn";
const $generateRanBtnSelector = ".random-board-btn";
const $executeBtnSelector = ".execute-btn";
const $heuristicSelectSelector = "#heuristic-select";
const $colSizeSelector = ".col-inp";
const $rowSizeSelector = ".row-inp";
const $startRadioSelector = "#start-element";
const $finishRadioSelector = "#finish-element";
const $obstacleRadioSelector = "#obstacle-element";
const $checkpointRadioSelector = "#checkpoint-element";
const $weightRadioSelector = "#weight-element";
const $radioInput = ".radio-btn";
const $weightInp = "#weight-inp";
const $obsPercentageSelector = "#wall-percentage-sel";
const $weight1Selector = "#weight-inp-1";
const $weight2Selector = "#weight-inp-2";
const $weight3Selector = "#weight-inp-3";
import $ from 'jquery';

import Board from './modules/model';
import AStar from "./modules/aStar";
import "./css/style.css";

let board;
let astar = new AStar("euclidean");
let checkpointCounter = 0;
let checkpointSelectors = [];
let checkpointsPos = [];
let resultPath = [];
let done = false;
$(document).ready(() => {
    $($weightInp).toggle();
    $($heuristicSelectSelector).on("change", onSelectHeuristic);
    $($boardSelector).on("click", ".cell", onClickCell);
    $($generateBtnSelector).on("click", onGenerateBoard);
    $($generateRanBtnSelector).on("click", onGenerateBoard);
    $($executeBtnSelector).on("click", onClickExecute);
    $($radioInput).on("click", onClickRadio);
});

function onGenerateBoard(event) {
    event.preventDefault();
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

function onClickExecute(event) {
    let initialStartCell, initialFinishCell;
    event.preventDefault();
    let completePath = [], currPath;
    let alertMsg ="";
    let lastSuccessfulCheckpoint; 

    if(!board) {
        alert("Debes generar primero un tablero.");
    }
    else if($.isEmptyObject(board.startCell))
        alert("No has puesto la celda inicial");
    else if($.isEmptyObject(board.finishCell))
        alert("No has puesto la celda final.")
    else {
        initialStartCell = board.startCell;
        initialFinishCell = board.finishCell;
        checkpointsPos.unshift(board.startCell);
        checkpointsPos.push(board.finishCell);
        
        lastSuccessfulCheckpoint = board.startCell;
        for(let i = 0; i < checkpointsPos.length - 1; i++) {
            currPath = [];
            board.startCell = lastSuccessfulCheckpoint;
            board.finishCell = checkpointsPos[i + 1];
            
            
            
            currPath = astar.search(board);
            if(currPath.length === 0)
                alertMsg += `No se ha podido encontrar un camino al checkpoint ${i + 1} \n`;
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
        done = true;
        board.startCell = initialStartCell;
        board.finishCell = initialFinishCell;
    }
}

function unpaintPath() {
    resultPath.forEach(cell => {        
        $(`#${cell.key}`).removeClass("path");
    });

    resultPath = [];
}
function paintPath(path) {
    path.forEach((cell, index) => {
        if(index < path.length - 1)
            setTimeout(() => {
                $(`#${cell.key}`).addClass("path");
            }, 200 * index);
    });

    resultPath = path;

}

function generateBoard(rowSize, colSize, random) {  
    done = false; 
    restart();
    if(random) {
        let w1 = parseInt($($weight1Selector).val()),
            w2 = parseInt($($weight2Selector).val()),
            w3 = parseInt($($weight3Selector).val()),
            percentage = parseFloat($($obsPercentageSelector).val());
            
        board = new Board(rowSize, colSize, random, w1, w2, w3, percentage);
    }
    else
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
        if(!$(this).hasClass("blocked") && !$(this).hasClass("checkpoint")
            && !$(this).hasClass("finish")) {
                if(done){
                    restart(true);
                    board.restart(true);
                    done = false;
        
                }
                $(".start").toggleClass("start");
                $(this).toggleClass("start");
                
                board.startCell = {row, col};
        }
        else 
            alert("No puedes poner la celda inicial aquí");

    }
    /* Ending cell */
    else if($($finishRadioSelector).is(":checked")) {
        if(!$(this).hasClass("blocked") && !$(this).hasClass("checkpoint")
            && !$(this).hasClass("start")) {
            if(done){
                restart(true);
                board.restart(true);
                done = false;
            }

            $(".finish").toggleClass("finish");
            $(this).toggleClass("finish");
            
            board.finishCell = {row, col};
        }
        else
            alert("No puedes poner la celda final aquí");
        
    }
    /* Obstacle cell */
    else if($($obstacleRadioSelector).is(":checked")) {
        if(!$(this).hasClass("start") && !$(this).hasClass("finish")) {
            if(done){
                restart(true);
                board.restart(true);
                done = false;
            }
            $(this).toggleClass("blocked");
            board.setBlockedCell(row, col);
        }
        else
            alert("No puedes bloquear esta celda.");
    }
    /* Checkpoint cell. */
    else if($($checkpointRadioSelector).is(":checked")) {
        if(!$(this).hasClass("start") && !$(this).hasClass("finish")
            && !$(this).hasClass("blocked")) {
            if(done){
                restart(true);
                board.restart(true);
                done = false;
            }   
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
        if(!$(this).hasClass("blocked")) {
            if(done){
                restart(true);
                board.restart(true);
                done = false;
            }
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
        else
            alert("No puedes colocarle un peso a esta celda. Está bloqueada.");
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

function onSelectHeuristic() {
    let heuristic = $($heuristicSelectSelector).val();
    astar.setHeuristicMethod(heuristic);
    
}



function restart(dontRestartCheckpoint = false) {
    if(astar)
        astar.clear();
    if(!dontRestartCheckpoint) {
        checkpointCounter = 0;
        checkpointSelectors = [];
        checkpointsPos = [];
    }
    else {
        checkpointsPos.splice(0, 1);
        checkpointsPos.splice(checkpointsPos.length - 1, 1);
    }
    unpaintPath();
}

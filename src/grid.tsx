'use client';
import GridNode from "./grid_node";
import { useEffect, useState, useReducer } from "react";
export default function Grid() {
    const [numsGrid, setNumsGrid] = useState(new Array<number>(81))
    const GRID_ROW_LENGTH = 9;
    const GRID_COL_LENGTH = 9;

    useEffect(() => {
        let grid = numsGrid;
        for (let i = 0; i < 81; i++) {
            grid[i] = 0
        }
        setNumsGrid(grid)
    }, [])

    function changeValue(row: number, col: number, value: string | undefined) {
        const newVal = Number(value ?? "0")
        var grid = [...numsGrid]
        grid[(row * 9) + col] = newVal
        setNumsGrid(grid)
    }

    function onClearClickHandler() {
        var grid = new Array<number>(81)
        for (let i = 0; i < 81; i++) {
            grid[i] = 0
        }
        setNumsGrid(grid)
    }

    function canNumberBeAdded(i: number, j: number, grid: number[], new_number: number){

        // Iterate over the rows to check if we can add new_number
        for(let row = 0; row < 9; row++){
            let index = (row * 9) + j
            if(grid[index] !== new_number){
                continue
            }
            return false
        }

        // Iterate over the columns to check if we can add new_number
        for(let col = 0; col < 9; col++){
            let index = (i * 9) + col
            if(grid[index] !== new_number){
                continue
            }
            return false
        }

        // Iterate over the 3x3 square to check if we can add new_number
        const row = Math.floor(i / 3) * 3
        const col = Math.floor(j / 3)
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                let index = (row + i) * 9 + (col * 3) + j
                if(grid[index] !== new_number){
                    continue
                }
                return false
            }
        }

        return true
}

    function createPromiseResult(val: boolean){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(val);
            });
          });
    }
    function delay (ms: number) {
        return new Promise((resolve,reject) => setTimeout(resolve,ms));
    }

    async function fillAnotherOne(i: number, j: number, prev_grid: number[]) {
        if (i == 9) {
            createPromiseResult(true)
        }
        var next_j = j + 1
        if (prev_grid[(i * 9) + j] !== 0) {
            return fillAnotherOne(i + Math.floor(next_j / 9), next_j % 9, prev_grid)
        }
        else {
            for(let num = 1; num < 10; num++){
                let can_be_added = canNumberBeAdded(i,j,prev_grid, num)
                if(!can_be_added){
                    continue
                }
                await delay(50);
                var grid = [...prev_grid]
                grid[(i * 9) + j] = num
                setNumsGrid(grid)
                const res = await fillAnotherOne(i + Math.floor(next_j / 9), next_j % 9, grid)
                if(res === true){
                    createPromiseResult(true)
                }
           }   
           return createPromiseResult(false)
        }
    }



    async function onSolveHandler() {
        const ans = await fillAnotherOne(0, 0, numsGrid)

    }

    return (<div>
        {[...Array(GRID_ROW_LENGTH)].map((x, i) =>
            <div>
                {[...Array(GRID_COL_LENGTH)].map((xy, j) =>
                    <GridNode init_value={numsGrid[(i * 9) + j]} row={i} col={j} changeValue={changeValue} />)}
            </div>)}
        <button className="button" onClick={onSolveHandler}>
            SOLVE
        </button>
        <button className="button" onClick={onClearClickHandler}>
            CLEAR
        </button>
    </div>
    )


}
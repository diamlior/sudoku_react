'use client';
import GridNode from "./grid_node";
import { useEffect, useState, useReducer } from "react";
export default function Grid() {
    const [numsGrid, setNumsGrid] = useState(new Array<number>(81))
    const [status, setStatus] = useState("valid")
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

    function canNumberBeAdded(i: number, j: number, grid: number[], new_number: number) : boolean{
        let curr_index = i * 9 + j

        // Iterate over the rows to check if we can add new_number
        for(let row = 0; row < 9; row++){
            let index = (row * 9) + j
            if(grid[index] !== new_number || index == curr_index){
                continue
            }
            return false
        }

        // Iterate over the columns to check if we can add new_number
        for(let col = 0; col < 9; col++){
            let index = (i * 9) + col
            if(grid[index] !== new_number || index == curr_index){
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
                if(grid[index] !== new_number || index == curr_index){
                    continue
                }
                return false
            }
        }

        return true
}

    function createPromiseResult(val: boolean): Promise<boolean>{
        return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(val);
            });
          });
    }
    function delay (ms: number){
        return new Promise((resolve,reject) => setTimeout(resolve,ms));
    }

    async function fillAnotherOne(i: number, j: number, prev_grid: number[]) : Promise<boolean> {
        const index = (i * 9) + j
        if (index == 81) {
            return createPromiseResult(true)
        }
        var next_j = j + 1
        if (prev_grid[index] !== 0) {
            // If number was given already, check if it is valid
            let is_valid = canNumberBeAdded(i,j,prev_grid, prev_grid[index])
            if (!is_valid)
                return createPromiseResult(false)
            return fillAnotherOne(i + Math.floor(next_j / 9), next_j % 9, prev_grid)
        }
        else {
            for(let num = 1; num < 10; num++){
                let can_be_added = canNumberBeAdded(i,j,prev_grid, num)
                if(!can_be_added){
                    continue
                }
                await delay(20);
                var grid = [...prev_grid]
                grid[index] = num
                setNumsGrid(grid)
                const res = await fillAnotherOne(i + Math.floor(next_j / 9), next_j % 9, grid)
                if(res === true){
                    return createPromiseResult(true)
                }
           }   
           return createPromiseResult(false)
        }
    }



    async function onSolveHandler() {
        setStatus("calculating")
        let isValid = true
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j ++){
                let index = i * 9 + j
                if(numsGrid[index] === 0){
                    continue
                }
                if(!canNumberBeAdded(i,j,numsGrid,numsGrid[index])){
                    isValid = false;
                    break;
                }
            }
            if (!isValid)
                break;
        }
        if(!isValid){
            setStatus("invalid")
            return
        }
        const ans = await fillAnotherOne(0, 0, numsGrid)
        ans ? setStatus("valid") : setStatus("invalid")
    }

    return (<div>
        <h1 className={`title ${status}_title`}>{status}</h1>
        {[...Array(GRID_ROW_LENGTH)].map((x, i) =>
            <div className="grid_content">
                {[...Array(GRID_COL_LENGTH)].map((xy, j) =>
                    <GridNode init_value={numsGrid[(i * 9) + j]} row={i} col={j} changeValue={changeValue} />)}
            </div>)}
            <div className='buttons_container'>
            <button className="button" onClick={onSolveHandler}>
            SOLVE
        </button>
        <button className="button" onClick={onClearClickHandler}>
            CLEAR
        </button>
            </div>
        
    </div>
    )


}
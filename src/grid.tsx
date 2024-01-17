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
    function fillAnotherOne(i: number, j: number, prev_grid: number[]) {
        if (i == 9) {
            return
        }
        var next_j = j + 1
        if (prev_grid[(i * 9) + j] !== 0) {
            fillAnotherOne(i + Math.floor(next_j/9), next_j % 9, prev_grid)
        }
        else {
            setTimeout(() => {
                var grid = [...prev_grid]
                grid[(i * 9) + j] = i + 1
                setNumsGrid(grid)
                fillAnotherOne(i + Math.floor(next_j/9), next_j % 9, grid)
            }, 50)
        }
    }
    function onSolveHandler() {
        fillAnotherOne(0, 0, numsGrid)
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
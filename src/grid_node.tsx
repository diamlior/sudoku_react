'use client';
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react"

interface GridNodeProps{
    init_value: number | null
    row: number
    col: number
    changeValue: (row: number, col: number, value: string | undefined) => void
}


export default function GridNode(props: GridNodeProps){
    
    const [value, setValue] = useState(props.init_value?.toString())
    const [tempValue, setTempValue] = useState(props.init_value?.toString())
    const [writeState, setWriteState] = useState(false)
    
    useEffect(() => {
        setValue(props.init_value?.toString())
    }, [props.init_value])

    function clickHandler(){
        setTempValue(value)
        setWriteState(true)

    }

    function handleTextareaChange(e: any){
        setTempValue(e.target.value)
    }

    function submitHandler(e: any){
        const chosenValue = e.target.value
        setTempValue(chosenValue)
        props.changeValue(props.row,props.col,chosenValue)
        setWriteState(false)
    }

    return (
        writeState ? 
        <div>
             <select className="text_box" onChange={submitHandler} onBlur={submitHandler} value={tempValue}>
             {[...Array(10)].map((xy, j) =>
                     <option value={j}>{j}</option>)}
            </select>
            
      </div>
         :
        <div className="node" onClick={clickHandler}>{value === undefined || value === "0" ? "." : value}</div>
    )
}
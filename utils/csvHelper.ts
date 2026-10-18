import fs from 'fs';
import path from 'path';

function toCsvCell(value:string):string{
    if(/[",\n]/.test(value)){
        return `"${value.replace(/"/g,'""')}"`;
    }
    return value;
}

export function saveAsCsv(filePath:string, headers:string[], rows:string[][]){
    const lines=[headers, ...rows].map(row=>row.map(toCsvCell).join(","));
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
}

function parseLine(line:string):string[]{
    const cells:string[]=[];
    let cell="";
    let inQuotes=false;

    for(let i=0; i<line.length; i++){
        const char=line[i];
        if(char==='"' && inQuotes && line[i+1]==='"'){
            cell+='"';
            i++;
        }else if(char==='"'){
            inQuotes=!inQuotes;
        }else if(char==="," && !inQuotes){
            cells.push(cell);
            cell="";
        }else{
            cell+=char;
        }
    }
    cells.push(cell);
    return cells;
}

export function readCsv(filePath:string):string[][]{
    const text=fs.readFileSync(filePath, "utf-8").trim();
    return text.split("\n").map(parseLine);
}

'use client'
import { useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";

interface startXY {
    x: number,
    y: number
};

export default function ImageLoader() {
    const [file, setFile] = useState<File[] | null>(null);
    const [previevImg, setPreview] = useState<string>('');
    const [logs, setLogs] = useState<React.ReactNode[]>([]);
    const logsBlock = useRef(null);

    const handleDrop = async (e:React.DragEvent<HTMLDivElement>) => {
        URL.revokeObjectURL(previevImg);
        e.preventDefault();
        e.stopPropagation();

        const droppedFiles = Array.from(e.dataTransfer.files)
        .filter(file => file.size <= 5242880 && file.type.startsWith('image/'))
        .slice(0, 1);
        if (droppedFiles.length > 0) {
            setFile(droppedFiles);
            setPreview(URL.createObjectURL(droppedFiles[0]));
            setLogs((prev => [...prev, <div key={prev.length} className="border p-2 my-2">{droppedFiles ? droppedFiles[0].name : "Incorrect input"}</div>]));
        }
    }
    
    const [labelPos, setLabelPos] = useState({ x: 20, y: 20 });
    
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragItemSize, setDragItemSize] = useState({width: 0, height: 0});

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        
        const rect = e.currentTarget.getBoundingClientRect();
        setDragItemSize({width: rect.width, height: rect.height});
        
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        
        setIsDragging(true);
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    
    let nextX = e.clientX - rect.left - dragOffset.x;
    let nextY = e.clientY - rect.top - dragOffset.y;

    const maxX = rect.width - dragItemSize.width; 
    const maxY = rect.height - dragItemSize.height;

    setLabelPos({
        x: Math.max(0, Math.min(nextX, maxX)),
        y: Math.max(0, Math.min(nextY, maxY))
    });
};

    const onMouseUp = () => {
        setIsDragging(false);
    };
    return(
        <Fragment>
            <div 
            className="relative w-full h-100 border-2 border-dashed bg-slate-100"
            style={{ backgroundImage: `url(${previevImg})`, backgroundSize: 'cover' }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp} 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <div
                onMouseDown={onMouseDown}
                style={{ 
                    left: `${labelPos.x}px`, 
                    top: `${labelPos.y}px`,
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
                className="absolute bg-white/80 p-2 rounded shadow-md select-none"
            >
                {file ? file[0].name : "Перетягніть фото"}
            </div>
        </div>
        <div ref={logsBlock} className="" id="log_img">{logs}</div>
        </Fragment>
    );
}
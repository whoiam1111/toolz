'use client';

import Drawbox from '@/app/about/components/Drawbox';
import { supabase } from '@/app/lib/supabase';
import { uploadImage } from '@/app/lib/storage';
import { useParams } from 'next/navigation';
import React, { useRef, useState, useEffect, useCallback } from 'react';

const LifeGraphCanvas = () => {
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const participantId = params?.id as string;
    const [drawing, setDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [aspectRatio, setAspectRatio] = useState(2);
    const [isErasing, setIsErasing] = useState(false);
    const [lineColor, setLineColor] = useState('#000000');
    const [eraserSize, setEraserSize] = useState(20);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });

    useEffect(() => {
        const image = new Image();
        image.src = '/lifegraph.png';
        image.onload = () => {
            setImg(image);
            setAspectRatio(image.width / image.height);
        };
    }, []);

    const resizeCanvas = useCallback(() => {
        const container = containerRef.current;
        const bgCanvas = bgCanvasRef.current;
        const drawCanvas = drawCanvasRef.current;

        if (!container || !bgCanvas || !drawCanvas || !img) return;

        const width = container.clientWidth;
        const height = width / aspectRatio;

        [bgCanvas, drawCanvas].forEach((canvas) => {
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
        });

        const bgCtx = bgCanvas.getContext('2d');
        if (bgCtx) {
            bgCtx.clearRect(0, 0, width, height);
            bgCtx.drawImage(img, 0, 0, width, height);
        }
    }, [img, aspectRatio]);

    useEffect(() => {
        if (img) {
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            return () => window.removeEventListener('resize', resizeCanvas);
        }
    }, [img, resizeCanvas]);

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const getTouchPos = useCallback((touch: Touch): { x: number; y: number } => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };
    }, []);

    const startDrawing = useCallback((pos: { x: number; y: number }) => {
        setDrawing(true);
        setLastPos(pos);
    }, []);

    const endDrawing = useCallback(() => {
        setDrawing(false);
        setLastPos(null);
    }, []);

    const drawLine = useCallback(
        (pos: { x: number; y: number }) => {
            setCursorPos(pos);
            if (!drawing || !lastPos) return;

            const canvas = drawCanvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!ctx) return;

            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = isErasing ? eraserSize : 2;
            ctx.strokeStyle = isErasing ? 'rgba(0,0,0,1)' : lineColor;
            ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';

            ctx.beginPath();
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();

            setLastPos(pos);
        },
        [drawing, lastPos, isErasing, eraserSize, lineColor]
    );

    // Touch event handlers
    useEffect(() => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return;

        const handleTouchStart = (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                const pos = getTouchPos(e.touches[0]);
                startDrawing(pos);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                const pos = getTouchPos(e.touches[0]);
                drawLine(pos);
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            e.preventDefault();
            endDrawing();
        };

        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);

        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
        };
    }, [getTouchPos, startDrawing, drawLine, endDrawing]);

    // Mouse event handlers
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        startDrawing(getMousePos(e));
    };
    const handleMouseUp = () => {
        endDrawing();
    };
    const handleMouseLeave = () => {
        endDrawing();
    };
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        drawLine(getMousePos(e));
    };

    const handleClear = () => {
        const canvas = drawCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleSave = async () => {
        const bgCanvas = bgCanvasRef.current;
        const drawCanvas = drawCanvasRef.current;
        if (!bgCanvas || !drawCanvas) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = drawCanvas.width;
        tempCanvas.height = drawCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.drawImage(bgCanvas, 0, 0);
        tempCtx.drawImage(drawCanvas, 0, 0);

        tempCanvas.toBlob(async (blob) => {
            if (!blob) return;

            const { url, error: uploadError } = await uploadImage('lifegraph', participantId, blob);

            if (uploadError || !url) {
                alert('업로드 실패: ' + (uploadError?.message ?? 'URL 생성 실패'));
                return;
            }

            const { error: insertError } = await supabase
                .from('lifegraphs')
                .insert([{ participant_id: participantId, image_url: url }]);

            if (insertError) {
                alert('DB 저장 실패: ' + insertError.message);
            } else {
                alert('저장 성공!');
            }
        }, 'image/png');
    };

    return (
        <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '12px', boxSizing: 'border-box' }}>
            <Drawbox
                setIsErasing={setIsErasing}
                isErasing={isErasing}
                handleClear={handleClear}
                handleSave={handleSave}
                lineColor={lineColor}
                setLineColor={setLineColor}
                eraserSize={eraserSize}
                setEraserSize={setEraserSize}
            />

            <div
                ref={containerRef}
                style={{ width: '100%', position: 'relative', aspectRatio: aspectRatio.toString() }}
            >
                <canvas
                    ref={bgCanvasRef}
                    style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}
                />
                <canvas
                    ref={drawCanvasRef}
                    style={{
                        width: '100%',
                        height: 'auto',
                        border: '1px solid #ccc',
                        cursor: isErasing ? 'none' : 'crosshair',
                        position: 'relative',
                        zIndex: 1,
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                />
                {isErasing && (
                    <div
                        style={{
                            position: 'absolute',
                            pointerEvents: 'none',
                            zIndex: 2,
                            borderRadius: '50%',
                            border: '2px solid #999',
                            background: 'rgba(255,255,255,0.5)',
                            width: eraserSize,
                            height: eraserSize,
                            transform: 'translate(-50%, -50%)',
                            left: `${cursorPos.x}px`,
                            top: `${cursorPos.y}px`,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default LifeGraphCanvas;

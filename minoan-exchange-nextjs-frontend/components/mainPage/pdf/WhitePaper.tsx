'use client'
import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
interface Props {

}

const WhitePaper: React.FC<Props> = () => {
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);

    // @ts-ignore
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className='m-4 mt-24'>
            <p>Page {pageNumber} of {numPages}</p>
                <div className='flex flex-row justify-center gap-x-4 lg:hidden'>
                    <button className='p-2 bg-slate-700 text-white border-2 border-gray-600 hover:scale-125 text-md' onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>Previous</button>
                    <button className='p-2 bg-slate-700 text-white border-2 border-gray-600 hover:scale-125 text-md' onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>Next</button>
                </div>
            <div className='text-center flex flex-row gap-x-64 justify-center'>
                <button className='hidden p-4 bg-slate-700 text-white border-2 border-gray-600 lg:inline self-center hover:scale-125' onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>Previous</button>
                <Document
                    file="/whitepaper/Minoan-white-paper.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        // scale={1.5}
                        className='scale-75 lg:scale-150'
                    />
                </Document>
                <button className='hidden p-4 bg-slate-700 text-white border-2 border-gray-600 lg:inline self-center hover:scale-125' onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>Next</button>
            </div>
        </div>
    );
}

export default WhitePaper

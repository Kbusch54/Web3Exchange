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
        <div className='text-center flex flex-row gap-x-12 justify-center'>
            <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber <= 1}>Previous</button>
            <Document
                file="/whitepaper/Minoan-white-paper.pdf"
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false} />
            </Document>
            <p>Page {pageNumber} of {numPages}</p>
            <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber >= numPages}>Next</button>
        </div>
    );
}

export default WhitePaper

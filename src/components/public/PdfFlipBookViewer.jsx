'use client';

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';

// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


export default function PdfFlipBookViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    console.log("fileUrl:", fileUrl);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  if (!isClient || typeof window === 'undefined') return null;

  return (
    <div className="flex justify-center items-center w-full">
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <HTMLFlipBook
          width={400}
          height={600}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          className="shadow-lg"
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div key={`page_${index + 1}`} className="page">
              <Page pageNumber={index + 1} width={400} />
            </div>
          ))}
        </HTMLFlipBook>
      </Document>
    </div>
  );
}

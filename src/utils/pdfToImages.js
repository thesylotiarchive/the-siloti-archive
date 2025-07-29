export async function getPdfPagesAsImages(pdfUrl) {
    // Dynamically import ONLY on client
    const pdfjsLib = await import("pdfjs-dist/build/pdf");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
  
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
  
    const images = [];
  
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
  
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
  
      canvas.width = viewport.width;
      canvas.height = viewport.height;
  
      await page.render({ canvasContext: context, viewport }).promise;
  
      images.push(canvas.toDataURL());
    }
  
    return images;
  }
  
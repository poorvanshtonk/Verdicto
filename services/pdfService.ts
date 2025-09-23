// Define a type for the pdfjsLib object that will be attached to the window
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

/**
 * Loads the PDF.js library from a CDN dynamically.
 * @returns A promise that resolves when the library is loaded or rejects on error.
 */
function loadPdfJsLibrary(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if the library is already loaded
    if (window.pdfjsLib) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${window.pdfjsLib.version}/pdf.worker.min.js`;
        resolve();
      } else {
        reject(new Error('Failed to load the PDF.js library.'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load the PDF.js library from the CDN.'));
    };
    
    document.body.appendChild(script);
  });
}

/**
 * Extracts text content from a given PDF file.
 * This function handles the dynamic loading of the necessary PDF.js library.
 * * @param file The PDF file to process.
 * @returns A promise that resolves with the extracted text as a single string, or rejects on error.
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // Ensure the PDF.js library is loaded before proceeding.
    await loadPdfJsLibrary();

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  } catch (error: any) {
    console.error('Failed to extract text from PDF:', error);
    throw new Error('Could not extract text from the PDF file. The file may be corrupted, password-protected, or in an unsupported format.');
  }
}

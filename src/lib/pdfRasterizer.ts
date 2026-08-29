export interface RenderedPage {
  pageIndex: number;
  dataUrl: string;
  width: number;
  height: number;
}

export async function rasterizeFileInBrowser(file: File): Promise<RenderedPage[]> {
  if (file.type.startsWith("image/") || file.name.match(/\.(png|jpe?g|webp|gif|svg)$/i)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve([
          {
            pageIndex: 0,
            dataUrl: result,
            width: 1000,
            height: 1400,
          },
        ]);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  try {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "3.11.174"}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const renderedPages: RenderedPage[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        await (page as any).render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        renderedPages.push({
          pageIndex: pageNum - 1,
          dataUrl: dataUrl,
          width: viewport.width,
          height: viewport.height,
        });
      }
    }

    return renderedPages;
  } catch (err) {
    console.warn("Browser PDF.js rasterization error, falling back:", err);
    return [];
  }
}

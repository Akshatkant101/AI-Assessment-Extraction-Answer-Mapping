import { PageImage } from "../store/sessionStore";

export interface UploadedFileInput {
  name: string;
  type: string;
  size: number;
  buffer: Buffer;
}

/**
 * Converts uploaded files into PageImage objects for the AI pipeline.
 *
 * - For images: converts the raw buffer to a base64 data URL.
 * - For PDFs: converts the raw buffer to a base64 data URL with application/pdf mime.
 *   Gemini 3.6 Flash natively supports PDF input, so no rasterization is needed.
 */
export async function rasterizeFile(
  input: UploadedFileInput,
): Promise<PageImage[]> {
  const base64 = input.buffer.toString("base64");

  // For images, return a single page with the image data URL
  if (
    input.type.startsWith("image/") ||
    input.name.match(/\.(png|jpe?g|webp|gif|svg)$/i)
  ) {
    let mime = input.type || "image/png";
    if (!mime || mime === "application/octet-stream") mime = "image/png";
    return [
      {
        pageIndex: 0,
        dataUrl: `data:${mime};base64,${base64}`,
        width: 1000,
        height: 1400,
      },
    ];
  }

  // For PDFs, send the raw PDF as a single "page" — Gemini 3.6 Flash
  // natively reads PDFs via inline_data with mime_type "application/pdf".
  // We store the whole PDF as one entry; the AI will see all pages.
  const mime = "application/pdf";
  return [
    {
      pageIndex: 0,
      dataUrl: `data:${mime};base64,${base64}`,
      width: 1000,
      height: 1400,
    },
  ];
}

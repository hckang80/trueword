import { getTodaysDate } from '@/shared';

export async function createVerseCard(verse: string, reference: string, src: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context is not available');

  canvas.width = 1080;
  canvas.height = 1080;

  const img = await loadImage(src);
  const optimizedImg = resizeImage(img, canvas.width, canvas.height);

  ctx.drawImage(optimizedImg, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Noto Sans KR"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = wrapText(ctx, verse, canvas.width - 100);
  const lineHeight = 60;
  const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
  });

  ctx.font = '32px "Noto Sans KR"';
  ctx.fillText(`- ${reference} -`, canvas.width / 2, canvas.height - 100);

  ctx.font = '28px "Noto Sans KR"';
  ctx.fillText(location.origin, canvas.width / 2, canvas.height - 60);

  img.src = src;
  return canvas;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function resizeImage(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context is not available');

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const imgAspect = img.width / img.height;
  const canvasAspect = targetWidth / targetHeight;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imgAspect > canvasAspect) {
    drawHeight = targetHeight;
    drawWidth = drawHeight * imgAspect;
    offsetX = (targetWidth - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = targetWidth;
    drawHeight = drawWidth / imgAspect;
    offsetX = 0;
    offsetY = (targetHeight - drawHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  return canvas;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine + word + ' ';
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  });

  lines.push(currentLine);
  return lines;
}

export async function shareVerseCard(verse: string, reference: string, backgroundImageSrc: string) {
  const canvas = await createVerseCard(verse, reference, backgroundImageSrc);

  canvas.toBlob(async (blob) => {
    if (!blob) throw new Error('Blob is not available');
    const filename = `${getTodaysDate()}_todays-verse.png`;
    const file = new File([blob], filename, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Today's Verse",
        text: `${verse} - ${reference}`
      });
    } else {
      downloadImage(canvas, filename);
    }
  }, 'image/png');
}

function downloadImage(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}

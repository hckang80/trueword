export async function createVerseCard(verse: string, reference: string, src: string) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context is not available');

  canvas.width = 1080;
  canvas.height = 1080;

  const img = await loadImage(src);

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

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
    const file = new File([blob], 'todays-verse.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: '오늘의 말씀',
        text: `${verse} - ${reference}`
      });
    } else {
      downloadImage(canvas, 'todays-verse.png');
    }
  }, 'image/png');
}

function downloadImage(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}

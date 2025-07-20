import { getTodaysDate } from '@/shared';
import { PHOTO_SIZE } from '../model';

/**
 * 캔버스에서 Blob을 생성하여 반환하는 유틸리티 함수
 * @param canvas - Blob으로 변환할 HTMLCanvasElement
 * @returns Blob Promise
 */
export async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blobResult) => {
      if (blobResult) {
        resolve(blobResult);
      } else {
        reject(new Error('Blob is not available'));
      }
    }, 'image/png');
  });
}

/**
 * 캔버스에서 생성된 Blob을 기반으로 File 객체를 반환하는 유틸리티 함수
 * @param canvas - File로 변환할 HTMLCanvasElement
 * @param filenamePrefix - 파일 이름에 붙을 접두사 (예: 'todays-verse')
 * @returns File Promise
 */
export async function getCanvasAsFile(blob: Blob, filenamePrefix: string): Promise<File> {
  const filename = `${filenamePrefix}_${getTodaysDate()}.png`;
  return new File([blob], filename, { type: 'image/png' });
}

/**
 * 이미지 URL을 로드하여 HTMLImageElement로 반환하는 함수
 * @param src - 이미지 소스 URL
 * @returns HTMLImageElement Promise
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 이미지를 캔버스에 맞게 리사이징하여 그리는 함수
 * @param img - 원본 HTMLImageElement
 * @param targetWidth - 캔버스의 목표 너비
 * @param targetHeight - 캔버스의 목표 높이
 * @returns 리사이징된 이미지가 그려진 HTMLCanvasElement
 */
export function resizeImage({
  img,
  targetWidth,
  targetHeight
}: {
  img: HTMLImageElement;
  targetWidth: number;
  targetHeight: number;
}): HTMLCanvasElement {
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

/**
 * 텍스트를 특정 너비에 맞춰 줄바꿈하는 함수
 * @param ctx - CanvasRenderingContext2D
 * @param text - 줄바꿈할 텍스트
 * @param maxWidth - 최대 너비
 * @returns 줄바꿈된 텍스트 배열
 */
export function wrapText({
  ctx,
  text,
  maxWidth
}: {
  ctx: CanvasRenderingContext2D;
  text: string;
  maxWidth: number;
}): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
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

/**
 * 캔버스에 구절 카드를 그리는 핵심 함수
 * @param verse - 성경 구절 텍스트
 * @param reference - 성경 구절 출처
 * @param src - 배경 이미지 URL
 * @returns {Promise<{ canvas: HTMLCanvasElement; file: File; url: string }>} 그려진 HTMLCanvasElement, File 객체, Blob URL을 포함하는 Promise
 */
export async function createVerseCard({
  verse,
  reference,
  src
}: {
  verse: string;
  reference: string;
  src: string;
}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context is not available');

  canvas.width = PHOTO_SIZE;
  canvas.height = PHOTO_SIZE;

  const img = await loadImage(src);
  const optimizedImg = resizeImage({ img, targetWidth: canvas.width, targetHeight: canvas.height });

  ctx.drawImage(optimizedImg, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px "Noto Sans KR"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = wrapText({ ctx, text: verse, maxWidth: canvas.width - 100 });
  const lineHeight = 60;
  const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
  });

  ctx.font = '32px "Noto Sans KR"';
  ctx.fillText(`- ${reference} -`, canvas.width / 2, canvas.height - 100);

  ctx.font = '28px "Noto Sans KR"';
  ctx.fillText(location.origin, canvas.width / 2, canvas.height - 60);

  const file = await getCanvasAsFile(await canvasToBlob(canvas), 'todays-verse');
  const url = URL.createObjectURL(file);

  return { canvas, file, url };
}

/**
 * 생성된 구절 카드 이미지를 다운로드하는 함수
 * @param canvas - 다운로드할 이미지가 그려진 HTMLCanvasElement
 * @param filename - 다운로드될 파일명
 */
export async function downloadImage(blob: Blob, filename: string): Promise<void> {
  const link = document.createElement('a');
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * 생성된 구절 카드 이미지를 웹 표준 공유 API 또는 다운로드를 통해 공유하는 함수
 * @param verse - 성경 구절 텍스트
 * @param reference - 성경 구절 출처
 * @param canvas - 공유할 이미지가 그려진 HTMLCanvasElement
 * @param file - 공유할 이미지의 File 객체
 * @returns Promise<void>
 */
export async function shareCard({
  verse,
  reference,
  canvas,
  file
}: {
  verse: string;
  reference: string;
  canvas: HTMLCanvasElement;
  file: File;
}): Promise<void> {
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: location.origin,
        text: `${verse}\n- ${reference} -\n${location.origin}`
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('이미지 공유가 취소되었습니다.');
      } else {
        console.error('이미지 공유 중 오류 발생:', error);
      }
    }
  } else {
    const blob = await canvasToBlob(canvas);
    await downloadImage(blob, file.name);
  }
}

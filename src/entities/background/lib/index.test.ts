import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  canvasToBlob,
  createVerseCard,
  downloadImage,
  getCanvasAsFile,
  loadImage,
  resizeImage,
  shareCard,
  wrapText
} from '.';
import { PHOTO_SIZE } from '../model';

const MOCK_DATE = '20250719';
vi.mock('@/shared', () => ({
  getTodaysDate: vi.fn(() => MOCK_DATE)
}));

const mockDrawImage = vi.fn();
const mockFillRect = vi.fn();
const mockFillText = vi.fn();
const mockMeasureText = vi.fn((text) => ({ width: text.length * 10 }));

const mockContext = {
  drawImage: mockDrawImage,
  fillRect: mockFillRect,
  fillText: mockFillText,
  measureText: mockMeasureText,
  font: '',
  textAlign: '',
  textBaseline: '',
  fillStyle: '',
  imageSmoothingEnabled: false,
  imageSmoothingQuality: ''
} as unknown as CanvasRenderingContext2D;

const mockToBlob = vi.fn((callback, type) => {
  const mockBlob = new Blob(['mock-image-data'], { type: type || 'image/png' });
  callback(mockBlob);
});
const mockToDataURL = vi.fn(() => 'data:image/png;base64,mockdata');

const mockCanvas = {
  getContext: vi.fn(() => mockContext),
  width: 0,
  height: 0,
  toBlob: mockToBlob,
  toDataURL: mockToDataURL
} as unknown as HTMLCanvasElement;

const createElementSpy = vi.spyOn(document, 'createElement');

createElementSpy.mockImplementation((tagName: string) => {
  if (tagName === 'canvas') {
    return mockCanvas;
  }
  if (tagName === 'a') {
    const mockAnchor: Partial<HTMLAnchorElement> = {
      download: '',
      href: '',
      click: mockLinkClick,
      style: {} as CSSStyleDeclaration
    };
    return mockAnchor as HTMLAnchorElement;
  }
  return document.createElement(tagName);
});

class MockImage extends EventTarget {
  src = '';
  crossOrigin = '';
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 0;
  height = 0;

  constructor() {
    super();
    setTimeout(() => {
      if (this.src) {
        this.width = 100;
        this.height = 100;
        this.onload?.();
      } else {
        this.onerror?.();
      }
    }, 10);
  }
}
vi.stubGlobal('Image', MockImage);

const mockCreateObjectURL = vi.fn(() => 'blob:http://mock-url/12345');
const mockRevokeObjectURL = vi.fn();
vi.stubGlobal('URL', {
  createObjectURL: mockCreateObjectURL,
  revokeObjectURL: mockRevokeObjectURL
});

// navigator.share 모킹
const mockCanShare = vi.fn(() => true);
const mockShare = vi.fn(async () => {});

Object.defineProperty(global, 'navigator', {
  value: {
    canShare: mockCanShare,
    share: mockShare
  },
  writable: true
});

const mockLinkClick = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();

const appendChildSpy = vi
  .spyOn(document.body, 'appendChild')
  .mockImplementation(() => mockAppendChild());
const removeChildSpy = vi
  .spyOn(document.body, 'removeChild')
  .mockImplementation(() => mockRemoveChild());

describe('Canvas Helper Functions', () => {
  let testFile: File;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCanvas.width = 0;
    mockCanvas.height = 0;
    vi.mocked(mockCanvas.getContext).mockReturnValue(mockContext);
    mockContext.font = '';
    mockContext.textAlign = 'start';
    mockContext.textBaseline = 'alphabetic';
    mockContext.fillStyle = '';
    mockContext.imageSmoothingEnabled = false;
    mockContext.imageSmoothingQuality = 'low';
    testFile = new File(['mock content'], `todays-verse_${MOCK_DATE}.png`, { type: 'image/png' });
  });

  describe('wrapText', () => {
    it('should wrap text correctly for multiple lines', () => {
      const text = 'This is a long sentence that needs to be wrapped into multiple lines.';
      const lines = wrapText({ ctx: mockContext, text, maxWidth: 200 });
      expect(lines.length).toBeGreaterThan(1);
      expect(lines[0]).not.toContain('that needs');
      expect(lines.join('')).toContain(
        'This is a long sentence that needs to be wrapped into multiple lines.'
      );
    });

    it('should return a single line if text fits within maxWidth', () => {
      const text = 'Short sentence.';
      const lines = wrapText({ ctx: mockContext, text, maxWidth: 200 });
      expect(lines).toEqual(['Short sentence. ']);
    });

    it('should handle empty text', () => {
      const lines = wrapText({ ctx: mockContext, text: '', maxWidth: 200 });
      expect(lines).toEqual([' ']);
    });
  });

  describe('loadImage', () => {
    it('should resolve with an Image object on successful load', async () => {
      const img = await loadImage('http://example.com/image.png');
      expect(img).toBeInstanceOf(MockImage);
      expect(img.src).toBe('http://example.com/image.png');
    });

    it('should reject on image load error', async () => {
      await expect(loadImage('')).rejects.toThrow();
    });
  });

  describe('resizeImage', () => {
    it('should return a canvas with the image drawn correctly', () => {
      const mockImg = new MockImage() as unknown as HTMLImageElement;
      mockImg.width = 200;
      mockImg.height = 100; // 넓은 이미지

      const resizedCanvas = resizeImage({ img: mockImg, targetWidth: 100, targetHeight: 100 });

      expect(resizedCanvas).toBe(mockCanvas);
      expect(mockCanvas.width).toBe(100);
      expect(mockCanvas.height).toBe(100);
      expect(mockDrawImage).toHaveBeenCalledWith(
        mockImg,
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number)
      );
      expect(mockContext.imageSmoothingEnabled).toBe(true);
      expect(mockContext.imageSmoothingQuality).toBe('high');
    });
  });

  describe('canvasToBlob', () => {
    it('should return a Blob object', async () => {
      const blob = await canvasToBlob(mockCanvas);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/png');
    });

    it('should throw an error if blob is not available', async () => {
      mockToBlob.mockImplementationOnce((callback) => callback(null));
      await expect(canvasToBlob(mockCanvas)).rejects.toThrow('Blob is not available');
    });
  });

  describe('getCanvasAsFile', () => {
    it('should return a File object with correct name and type', async () => {
      const file = await getCanvasAsFile(new Blob(), 'my-prefix');
      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe(`my-prefix_${MOCK_DATE}.png`);
      expect(file.type).toBe('image/png');
    });
  });

  describe('createVerseCard', () => {
    it('should draw all elements onto the canvas', async () => {
      const verse = 'Test Verse';
      const reference = 'Test Ref';
      const src = 'http://example.com/bg.png';

      const { canvas, file, url } = await createVerseCard({ verse, reference, src });

      expect(canvas).toBe(mockCanvas);
      expect(mockCanvas.width).toBe(PHOTO_SIZE);
      expect(mockCanvas.height).toBe(PHOTO_SIZE);
      expect(mockDrawImage).toHaveBeenCalledTimes(2);
      expect(mockFillRect).toHaveBeenCalledTimes(1);
      expect(mockFillText).toHaveBeenCalledTimes(3);

      expect(mockContext.font).toContain('Noto Sans KR');
      expect(mockContext.textAlign).toBe('center');

      expect(file).toBeInstanceOf(File);

      expect(url).toBe('blob:http://mock-url/12345');
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    });

    it('should throw error if canvas context is not available', async () => {
      mockCanvas.getContext = vi.fn(() => null);
      await expect(createVerseCard({ verse: 'v', reference: ' r', src: 's' })).rejects.toThrow(
        'Canvas context is not available'
      );
    });
  });

  describe('downloadImage', () => {
    it('should trigger a file download', async () => {
      await downloadImage(new Blob(), 'test-download.png');

      expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
      expect(mockLinkClick).toHaveBeenCalledTimes(1);
      expect(appendChildSpy).toHaveBeenCalledTimes(1);
      expect(removeChildSpy).toHaveBeenCalledTimes(1);
      expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
    });
  });

  describe('shareCard', () => {
    it('should use navigator.share if available and supported', async () => {
      mockCanShare.mockReturnValue(true);
      await shareCard({
        verse: 'Verse',
        reference: 'Reference',
        canvas: mockCanvas,
        file: testFile
      });

      expect(mockShare).toHaveBeenCalledTimes(1);
      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({
          files: [testFile],
          title: location.origin,
          text: `Verse\n- Reference -`
        })
      );
      expect(createElementSpy).not.toHaveBeenCalledWith('a');
    });

    it('should log error if navigator.share fails (not AbortError)', async () => {
      mockCanShare.mockReturnValue(true);
      mockShare.mockRejectedValueOnce(new Error('Share failed'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await shareCard({
        verse: 'Verse',
        reference: 'Reference',
        canvas: mockCanvas,
        file: testFile
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('이미지 공유 중 오류 발생:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });
});

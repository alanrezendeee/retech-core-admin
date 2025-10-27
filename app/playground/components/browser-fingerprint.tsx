'use client';

import { useEffect, useState } from 'react';

interface BrowserFingerprint {
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  cookieEnabled: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  canvas: string;
  webgl: string;
  audio: string;
  fonts: string[];
  plugins: string[];
  timestamp: number;
}

export function useBrowserFingerprint() {
  const [fingerprint, setFingerprint] = useState<BrowserFingerprint | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    generateFingerprint();
  }, []);

  const generateFingerprint = async () => {
    try {
      setIsGenerating(true);

      // ✅ Gerar fingerprint básico primeiro (rápido)
      const basicFp: BrowserFingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookieEnabled: navigator.cookieEnabled,
        localStorage: testLocalStorage(),
        sessionStorage: testSessionStorage(),
        canvas: generateCanvasFingerprint(),
        webgl: generateWebGLFingerprint(),
        audio: 'generating...', // Será gerado depois
        fonts: [],
        plugins: [],
        timestamp: Date.now(),
      };

      // ✅ Liberar a UI imediatamente com fingerprint básico
      setFingerprint(basicFp);
      setIsGenerating(false);
      console.log('🔒 [BROWSER FINGERPRINT] Básico gerado:', basicFp);

      // ✅ Gerar partes pesadas em background (não bloqueia UI)
      setTimeout(async () => {
        try {
          const audio = await Promise.race([
            generateAudioFingerprint(),
            new Promise<string>((resolve) => setTimeout(() => resolve('audio-timeout'), 2000))
          ]);
          
          const fonts = detectFonts();
          const plugins = detectPlugins();

          const completeFp: BrowserFingerprint = {
            ...basicFp,
            audio,
            fonts,
            plugins,
          };

          setFingerprint(completeFp);
          console.log('🔒 [BROWSER FINGERPRINT] Completo:', completeFp);
        } catch (error) {
          console.error('❌ [BROWSER FINGERPRINT] Erro nas partes pesadas:', error);
        }
      }, 100);
    } catch (error) {
      console.error('❌ [BROWSER FINGERPRINT] Erro:', error);
      // ✅ Mesmo com erro, libera a UI
      setIsGenerating(false);
    }
  };

  const testLocalStorage = (): boolean => {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  const testSessionStorage = (): boolean => {
    try {
      const test = 'test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  const generateCanvasFingerprint = (): string => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';

      // Desenhar texto com características únicas
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('BrowserFingerprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('BrowserFingerprint', 4, 17);

      return canvas.toDataURL();
    } catch {
      return 'canvas-error';
    }
  };

  const generateWebGLFingerprint = (): string => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      if (!gl) return 'no-webgl';

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return 'no-debug-info';

      const vendor = gl.getParameter((debugInfo as any).UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter((debugInfo as any).UNMASKED_RENDERER_WEBGL);

      return `${vendor}|${renderer}`;
    } catch {
      return 'webgl-error';
    }
  };

  const generateAudioFingerprint = async (): Promise<string> => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);

      oscillator.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(0);

      return new Promise((resolve) => {
        scriptProcessor.onaudioprocess = (event) => {
          const data = event.inputBuffer.getChannelData(0);
          const fingerprint = Array.from(data.slice(0, 30))
            .map(x => x.toString(36))
            .join('');
          
          oscillator.stop();
          audioContext.close();
          resolve(fingerprint);
        };
      });
    } catch {
      return 'audio-error';
    }
  };

  const detectFonts = (): string[] => {
    const testFonts = [
      'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
      'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
      'Trebuchet MS', 'Arial Black', 'Impact', 'Tahoma', 'Calibri'
    ];

    const detectedFonts: string[] = [];
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    const h = document.createElement('span');
    h.style.fontSize = testSize;
    h.style.position = 'absolute';
    h.style.left = '-9999px';
    h.style.top = '-9999px';
    h.innerHTML = testString;
    document.body.appendChild(h);

    const defaultWidth = h.offsetWidth;
    const defaultHeight = h.offsetHeight;

    for (const font of testFonts) {
      h.style.fontFamily = font;
      if (h.offsetWidth !== defaultWidth || h.offsetHeight !== defaultHeight) {
        detectedFonts.push(font);
      }
    }

    document.body.removeChild(h);
    return detectedFonts;
  };

  const detectPlugins = (): string[] => {
    const plugins: string[] = [];
    
    for (let i = 0; i < navigator.plugins.length; i++) {
      const plugin = navigator.plugins[i];
      plugins.push(plugin.name);
    }

    return plugins;
  };

  const getFingerprintHash = (): string => {
    if (!fingerprint) return '';

    const data = JSON.stringify(fingerprint);
    let hash = 0;
    
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36);
  };

  return {
    fingerprint,
    isGenerating,
    getFingerprintHash,
    regenerate: generateFingerprint,
  };
}

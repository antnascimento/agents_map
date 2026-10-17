/**
 * Procedural Ambient Audio Synthesizer (Web Audio API)
 * Inspired by the soothing, infinite ambient soundscapes of Slow Roads.
 * Generates warm analog synth pads, pentatonic melodic bells, and atmospheric air.
 * Zero external audio downloads, 100% reliable, zero latency.
 */

export class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private padGain: GainNode | null = null;
  private chimeGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;

  private chordIntervalId: any = null;
  private chimeIntervalId: any = null;
  private volume: number = 0.4;

  // Soothing chord progressions in C Lydian / Pentatonic
  // Frequencies in Hz: C4, E4, G4, B4, D5, etc.
  private chordProgressions = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7 (Peaceful, airy)
    [220.00, 261.63, 329.63, 392.00], // Am7 (Introspective)
    [349.23, 440.00, 523.25, 659.25], // Fmaj7 (Expansive, uplifting)
    [293.66, 349.23, 440.00, 523.25], // Dm7 (Gentle horizon)
    [392.00, 493.88, 587.33, 698.46], // G7sus (Floating)
  ];

  private chimeScale = [
    523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, // C5, D5, E5, G5, A5, C6, D6
  ];

  private currentChordIndex = 0;
  private activeOscillators: OscillatorNode[] = [];

  constructor() {
    // AudioContext is initialized on first user gesture to comply with browser autoplay policies
  }

  private initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioCtx();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Warm Lowpass Filter (emulates vintage analog synth pad)
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(650, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(1.8, this.ctx.currentTime);
    this.filter.connect(this.masterGain);

    // Sub-bus for pads
    this.padGain = this.ctx.createGain();
    this.padGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.padGain.connect(this.filter);

    // Sub-bus for melodic chimes
    this.chimeGain = this.ctx.createGain();
    this.chimeGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    this.chimeGain.connect(this.masterGain);
  }

  public play() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Start chord cycle
    this.triggerNextChord();
    this.chordIntervalId = setInterval(() => {
      this.triggerNextChord();
    }, 6000); // Transitions every 6 seconds

    // Start gentle melodic chimes
    this.chimeIntervalId = setInterval(() => {
      if (Math.random() > 0.3) {
        this.triggerChime();
      }
    }, 1800);
  }

  public pause() {
    this.isPlaying = false;
    if (this.chordIntervalId) clearInterval(this.chordIntervalId);
    if (this.chimeIntervalId) clearInterval(this.chimeIntervalId);

    // Fade out and stop active oscillators
    const now = this.ctx ? this.ctx.currentTime : 0;
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop(now + 0.5);
      } catch (e) {}
    });
    this.activeOscillators = [];
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private triggerNextChord() {
    if (!this.ctx || !this.padGain || !this.isPlaying) return;

    const chord = this.chordProgressions[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgressions.length;

    const now = this.ctx.currentTime;
    const fadeDuration = 5.8;

    // Slowly open and close filter frequency for subtle movement (breathing synth)
    if (this.filter) {
      const targetFreq = 450 + Math.sin(now * 0.4) * 250;
      this.filter.frequency.setTargetAtTime(targetFreq, now, 2.0);
    }

    // Spawn oscillators for the chord notes
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.padGain) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Mix saw + sine for smooth rich texture
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Micro-detune for lush chorus shimmer
      const detune = (idx - 1.5) * 3.5;
      osc.detune.setValueAtTime(detune, now);

      // Envelope: Soft attack, sustain, smooth release
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.08, now + 1.8);
      noteGain.gain.linearRampToValueAtTime(0.05, now + fadeDuration - 1.2);
      noteGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);

      osc.connect(noteGain);
      noteGain.connect(this.padGain);

      osc.start(now);
      osc.stop(now + fadeDuration);

      this.activeOscillators.push(osc);
    });

    // Cleanup ended oscillators
    setTimeout(() => {
      this.activeOscillators = this.activeOscillators.filter((o) => {
        try {
          return (o as any).playbackState !== 3;
        } catch {
          return false;
        }
      });
    }, fadeDuration * 1000);
  }

  private triggerChime() {
    if (!this.ctx || !this.chimeGain || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const note = this.chimeScale[Math.floor(Math.random() * this.chimeScale.length)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, now);

    // Bell chime envelope: Instant attack, long exponential decay
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    osc.connect(gain);
    gain.connect(this.chimeGain);

    osc.start(now);
    osc.stop(now + 2.5);
  }

  // --- DOOM-INSPIRED PROCEDURAL COMBAT SOUND EFFECTS ---

  /**
   * High-impact Doom-style plasma / shotgun blast
   */
  public playPlayerShoot() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;

    // 1. Heavy saw/square punch with rapid pitch drop
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.25);

    // 2. White noise punch / muzzle pop
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.Q.setValueAtTime(2.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(now);
  }

  /**
   * Red enemy robot plasma blaster zap
   */
  public playRobotLaser() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  /**
   * Metallic bullet/plasma impact clank
   */
  public playRobotHit() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  /**
   * Robot destruction explosion
   */
  public playRobotExplosion() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;

    // Sub rumble
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + 0.6);

    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    subOsc.start(now);
    subOsc.stop(now + 0.75);

    // Crackling debris noise
    const bufferSize = this.ctx.sampleRate * 0.45;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(now);
  }

  /**
   * Player hurt glitch / damage alarm
   */
  public playPlayerHurt() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.setValueAtTime(110, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  /**
   * Weapon equip slide / ready click
   */
  public playWeaponEquip() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(950, now + 0.06);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // --- R-TYPE 3D SPACE FIGHTER SOUND EFFECTS ---

  /**
   * Drone Heavy Twin Plasma Cannon Blast (Punchy sub-bass + high velocity energy zap)
   */
  public playDroneCannon() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;

    // 1. Transient Zap Oscillator
    const zapOsc = this.ctx.createOscillator();
    const zapGain = this.ctx.createGain();
    zapOsc.type = 'sawtooth';
    zapOsc.frequency.setValueAtTime(1400, now);
    zapOsc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

    zapGain.gain.setValueAtTime(0.4, now);
    zapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    zapOsc.connect(zapGain);
    zapGain.connect(this.masterGain);
    zapOsc.start(now);
    zapOsc.stop(now + 0.15);

    // 2. Punchy Sub-Bass Impact Thump
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(160, now);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 0.22);
  }

  /**
   * Alien Raider Ship Explosion (Deep atmospheric thunder blast)
   */
  public playAlienShipExplosion() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.9);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.25));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(70, now + 0.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);

    // Deep sub boom
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'triangle';
    sub.frequency.setValueAtTime(110, now);
    sub.frequency.exponentialRampToValueAtTime(30, now + 0.6);
    subGain.gain.setValueAtTime(0.6, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start(now);
    sub.stop(now + 0.7);
  }

  /**
   * Target Lock Beep
   */
  public playTargetLockBeep() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1760, now + 0.04);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Alien Raider Energy Laser Shot
   */
  public playAlienShipLaser() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.16);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.19);
  }
}

// Global audio engine singleton
export const ambientAudio = typeof window !== 'undefined' ? new AmbientAudioEngine() : (null as any);


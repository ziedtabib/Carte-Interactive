"use client"

// Sound effect URLs (using free sound effects)
const SOUNDS = {
  pop: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  success: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
  click: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  magic: "https://assets.mixkit.co/active_storage/sfx/2576/2576-preview.mp3",
  whoosh: "https://assets.mixkit.co/active_storage/sfx/2574/2574-preview.mp3",
}

type SoundType = keyof typeof SOUNDS

let audioContext: AudioContext | null = null
const audioCache: Map<string, AudioBuffer> = new Map()

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return audioContext
}

export async function playSound(type: SoundType, volume: number = 0.5): Promise<void> {
  try {
    const ctx = getAudioContext()
    
    // Resume context if suspended (required by browsers)
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    let buffer = audioCache.get(type)
    
    if (!buffer) {
      const response = await fetch(SOUNDS[type])
      const arrayBuffer = await response.arrayBuffer()
      buffer = await ctx.decodeAudioData(arrayBuffer)
      audioCache.set(type, buffer)
    }

    const source = ctx.createBufferSource()
    const gainNode = ctx.createGain()
    
    source.buffer = buffer
    gainNode.gain.value = volume
    
    source.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    source.start(0)
  } catch (error) {
    console.warn('Sound playback failed:', error)
  }
}

// Simple fallback using HTML5 Audio
export function playSoundSimple(type: SoundType, volume: number = 0.5): void {
  try {
    const audio = new Audio(SOUNDS[type])
    audio.volume = volume
    audio.play().catch(() => {
      // Ignore autoplay errors
    })
  } catch {
    // Ignore errors
  }
}

/** Fichier dans `public/music/` — encodé pour les caractères spéciaux dans l’URL */
export const BACKGROUND_MUSIC_SRC =
  "/music/" + encodeURIComponent("[Dora ]أهلاً......ited].mp3")

// Background music controller
let bgMusic: HTMLAudioElement | null = null

function ensureBgMusic(): HTMLAudioElement {
  if (!bgMusic) {
    bgMusic = new Audio(BACKGROUND_MUSIC_SRC)
    bgMusic.loop = false
    bgMusic.volume = 0.28
    const emit = () => {
      window.dispatchEvent(
        new CustomEvent("site-background-music", { detail: { playing: !bgMusic!.paused } })
      )
    }
    bgMusic.addEventListener("play", emit)
    bgMusic.addEventListener("pause", emit)
    bgMusic.addEventListener("ended", () => {
      window.dispatchEvent(new CustomEvent("site-background-music", { detail: { playing: false } }))
    })
  }
  return bgMusic
}

export function toggleBackgroundMusic(play: boolean): void {
  const audio = ensureBgMusic()
  if (play) {
    audio.play().catch(() => {})
  } else {
    audio.pause()
  }
}

export function isMusicPlaying(): boolean {
  return bgMusic ? !bgMusic.paused : false
}

let siteMusicAutoplayRegistered = false

/**
 * À l’ouverture du site : tente de lancer la musique une fois (sans boucle).
 * Si le navigateur bloque l’autoplay, la lecture démarre au premier clic / toucher / touche.
 */
export function registerSiteMusicAutoplay(): void {
  if (typeof window === "undefined" || siteMusicAutoplayRegistered) return
  siteMusicAutoplayRegistered = true

  const audio = ensureBgMusic()
  let interactionListenersRemoved = false

  const removeListeners = () => {
    if (interactionListenersRemoved) return
    interactionListenersRemoved = true
    document.removeEventListener("click", unlockFromInteraction)
    document.removeEventListener("touchstart", unlockFromInteraction)
    document.removeEventListener("keydown", unlockFromInteraction)
  }

  /** Débloque l’autoplay après un geste utilisateur (politique navigateur). */
  const unlockFromInteraction = () => {
    audio
      .play()
      .then(() => removeListeners())
      .catch(() => {})
  }

  audio
    .play()
    .then(() => removeListeners())
    .catch(() => {
      document.addEventListener("click", unlockFromInteraction, { passive: true })
      document.addEventListener("touchstart", unlockFromInteraction, { passive: true })
      document.addEventListener("keydown", unlockFromInteraction)
    })
}

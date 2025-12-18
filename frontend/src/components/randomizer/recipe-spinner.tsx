"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export interface Recipe {
    id: number
    name: string
    slug: string
    image_url: string | null
    author?: {
        name: string
    }
    city?: {
        name: string
    }
}

interface RecipeSpinnerProps {
    recipes: Recipe[]
    spinning: boolean
    onSpinComplete?: (winner: Recipe) => void
}

export function RecipeSpinner({ recipes, spinning, onSpinComplete }: RecipeSpinnerProps) {
    const trackRef = React.useRef<HTMLDivElement>(null)
    const audioContextRef = React.useRef<AudioContext | null>(null)
    const lastTickIndexRef = React.useRef<number>(-1)
    const animationFrameRef = React.useRef<number | null>(null)
    const hasStartedRef = React.useRef<boolean>(false)

    const [winnerIndex, setWinnerIndex] = React.useState<number | null>(null)
    const [translateX, setTranslateX] = React.useState(0)
    const [isAnimating, setIsAnimating] = React.useState(false)
    const [showResult, setShowResult] = React.useState(false)

    const CARD_WIDTH = 180
    const CARD_GAP = 12
    const CARD_TOTAL = CARD_WIDTH + CARD_GAP

    // Initialize audio context
    const initAudio = React.useCallback(() => {
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
            } catch (e) {
                console.warn("Audio not available")
            }
        }
        return audioContextRef.current
    }, [])

    // Play tick sound
    const playTick = React.useCallback(() => {
        const ctx = audioContextRef.current
        if (!ctx) return

        try {
            const oscillator = ctx.createOscillator()
            const gainNode = ctx.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(ctx.destination)

            oscillator.frequency.value = 500 + Math.random() * 300
            oscillator.type = 'sine'

            gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)

            oscillator.start(ctx.currentTime)
            oscillator.stop(ctx.currentTime + 0.05)
        } catch (e) { }
    }, [])

    // Play win sound
    const playWinSound = React.useCallback(() => {
        const ctx = audioContextRef.current
        if (!ctx) return

        try {
            const frequencies = [523, 659, 784, 1047]
            frequencies.forEach((freq, i) => {
                setTimeout(() => {
                    const oscillator = ctx.createOscillator()
                    const gainNode = ctx.createGain()

                    oscillator.connect(gainNode)
                    gainNode.connect(ctx.destination)

                    oscillator.frequency.value = freq
                    oscillator.type = 'sine'

                    gainNode.gain.setValueAtTime(0.12, ctx.currentTime)
                    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

                    oscillator.start(ctx.currentTime)
                    oscillator.stop(ctx.currentTime + 0.4)
                }, i * 80)
            })
        } catch (e) { }
    }, [])

    // Track animation for tick sounds
    const trackAnimationLoop = React.useCallback(() => {
        if (!trackRef.current || !isAnimating) return

        try {
            const transform = getComputedStyle(trackRef.current).transform
            if (transform && transform !== 'none') {
                const matrix = new DOMMatrix(transform)
                const currentX = Math.abs(matrix.m41)
                const cardAtCenter = Math.floor(currentX / CARD_TOTAL)

                if (cardAtCenter !== lastTickIndexRef.current && cardAtCenter >= 0) {
                    lastTickIndexRef.current = cardAtCenter
                    playTick()
                }
            }
        } catch (e) { }

        animationFrameRef.current = requestAnimationFrame(trackAnimationLoop)
    }, [isAnimating, CARD_TOTAL, playTick])

    // Handle spinning state change
    React.useEffect(() => {
        if (spinning && recipes.length > 0 && !hasStartedRef.current) {
            hasStartedRef.current = true

            // Initialize audio on user interaction
            initAudio()

            // Reset for new spin
            setShowResult(false)
            lastTickIndexRef.current = -1

            // Pick winner
            const minIndex = Math.max(recipes.length - 8, Math.floor(recipes.length * 0.7))
            const maxIndex = recipes.length - 3
            const targetIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex

            setWinnerIndex(targetIndex)

            // Calculate position
            const winnerCenterOffset = (targetIndex * CARD_TOTAL) + (CARD_WIDTH / 2)
            setTranslateX(-winnerCenterOffset)

            // Start animating
            setIsAnimating(true)
        }

        if (!spinning && hasStartedRef.current) {
            hasStartedRef.current = false
        }
    }, [spinning, recipes, CARD_TOTAL, CARD_WIDTH, initAudio])

    // Start/stop animation tracking
    React.useEffect(() => {
        if (isAnimating) {
            animationFrameRef.current = requestAnimationFrame(trackAnimationLoop)

            // Complete after 5 seconds
            const timeout = setTimeout(() => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current)
                    animationFrameRef.current = null
                }

                setIsAnimating(false)
                setShowResult(true)
                playWinSound()

                if (winnerIndex !== null) {
                    onSpinComplete?.(recipes[winnerIndex])
                }
            }, 5000)

            return () => {
                clearTimeout(timeout)
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current)
                    animationFrameRef.current = null
                }
            }
        }
    }, [isAnimating, winnerIndex, recipes, onSpinComplete, trackAnimationLoop, playWinSound])

    // Cleanup
    React.useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(() => { })
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [])

    const currentTransform = (isAnimating || showResult)
        ? `translateX(${translateX}px)`
        : `translateX(${CARD_TOTAL * 2}px)`

    return (
        <div className="relative w-full overflow-hidden rounded-xl border bg-background/80 backdrop-blur py-6" dir="ltr">
            {/* Center Selection Indicator */}
            <div className="absolute left-1/2 top-0 z-20 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-primary via-primary to-primary shadow-[0_0_15px_3px_rgba(var(--primary),0.4)]">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-primary"></div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-primary"></div>
            </div>

            {/* Edge Fade Gradients */}
            <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>

            {/* Scrolling Track Container */}
            <div className="relative h-[220px] flex items-center justify-center overflow-hidden">
                <div
                    ref={trackRef}
                    className="absolute flex items-center"
                    style={{
                        gap: `${CARD_GAP}px`,
                        left: '50%',
                        transform: currentTransform,
                        transition: isAnimating
                            ? 'transform 5s cubic-bezier(0.15, 0.05, 0.05, 1)'
                            : 'none',
                    }}
                >
                    {recipes.map((recipe, index) => {
                        const isWinner = winnerIndex === index && (isAnimating || showResult)
                        return (
                            <Card
                                key={`${recipe.id}-${index}`}
                                className={`shrink-0 overflow-hidden transition-all duration-500 relative ${isWinner && showResult
                                    ? 'ring-4 ring-primary scale-110 shadow-2xl z-30'
                                    : isWinner
                                        ? 'ring-2 ring-primary/50 scale-105'
                                        : 'border-2 border-border'
                                    }`}
                                style={{ width: `${CARD_WIDTH}px` }}
                                dir="rtl"
                            >
                                <div className="relative h-28 w-full bg-muted">
                                    {recipe.image_url ? (
                                        <Image
                                            src={recipe.image_url}
                                            alt={recipe.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                                            لا توجد صورة
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-2">
                                    <h3 className="truncate font-bold text-sm" title={recipe.name}>
                                        {recipe.name}
                                    </h3>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {recipe.city?.name}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>

            <style jsx>{`
                @keyframes cardShine {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    )
}

"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import MainLayout from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Loader2, Home, Receipt, Gift, Sparkles } from "lucide-react"
import { verifyPayment } from "@/services/payment"

// Minimal confetti using canvas (no new deps)
function useConfetti(enabled: boolean) {
  const canvasRef = useRef(null as HTMLCanvasElement | null)
  useEffect(() => {
    if (!enabled || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    let width = canvas.width = window.innerWidth
    let height = canvas.height = window.innerHeight
    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const colors = ["#10b981", "#22c55e", "#16a34a", "#84cc16", "#34d399", "#06b6d4"]
    const pieces = Array.from({ length: 180 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * -height,
      r: 4 + Math.random() * 6,
      s: 2 + Math.random() * 3,
      a: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of pieces) {
        p.y += p.s
        p.x += Math.sin(p.a) * 0.8
        p.a += 0.02
        if (p.y > height) {
          p.y = -10
          p.x = Math.random() * width
        }
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      ctx.clearRect(0, 0, width, height)
    }
  }, [enabled])
  return canvasRef
}

export default function SuccessPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")
  const [reference, setReference] = useState<string>("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get("reference") || params.get("ref") || params.get("tx_ref") || ""
    setReference(ref)
  }, [])

  useEffect(() => {
    const run = async () => {
      if (!reference) return
      setStatus("loading")
      try {
        const resp = await verifyPayment(reference)
        const ok = (resp as any)?.status === true || (resp as any)?.data?.status === true
        const msg = (resp as any)?.message || (resp as any)?.data?.message || "Payment verified successfully."
        setMessage(msg)
        setStatus(ok ? "success" : "error")
      } catch (err: any) {
        let msg = "We couldn't verify your payment at the moment."
        if (err?.response?.data?.responseMessage) msg = err.response.data.responseMessage
        else if (err?.response?.data?.message) msg = err.response.data.message
        setMessage(msg)
        setStatus("error")
      }
    }
    run()
  }, [reference])

  const TitleIcon = useMemo(() => {
    if (status === "loading") return Loader2
    if (status === "success") return CheckCircle2
    if (status === "error") return AlertCircle
    return Loader2
  }, [status])

  const confettiRef = useConfetti(status === "success");

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Mini Hero Section (like shop) */}
        <section className="relative h-[300px] overflow-visible">
          <div className="absolute inset-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/previous-sunday-1-mvsBAuZ8fv6sQ9BIEJLOZ7sL3xWqBZ.png"
              alt="Success Hero"
              fill
              className="object-cover brightness-[0.4]"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
          <div className="relative h-full flex items-center justify-center text-center text-white px-4 pt-20">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight flex items-center justify-center">
                {status === "loading" && (
                  <>
                    <span>Verification</span>
                    <span className="inline-flex items-end gap-1 ml-3">
                      <span className="w-2 h-2 rounded-full bg-white/90 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-white/90 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-white/90 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </>
                )}
                {status === "success" && "Thank You"}
                {status === "error" && "Payment Verification Pending"}
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                {status === "loading" && "We’re confirming your payment. This may take a moment."}
                {status === "success" && "Your payment has been confirmed. A receipt will arrive via email shortly."}
                {status === "error" && (message || "We couldn't confirm your payment yet. Please refresh or try again later.")}
              </p>
            </div>
          </div>
          {/* Center icon straddling hero and content */}
          <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[65%] z-50">
            <div
              className={`w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center shadow-xl ring-1 ring-white/30 ${status === 'success' ? 'bg-green-100 text-green-600' : status === 'error' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}
            >
              <TitleIcon className={`h-14 w-14 md:h-16 md:w-16 ${status === 'loading' ? 'animate-spin' : ''}`} />
            </div>
          </div>
        </section>

        <div className="relative px-4 pt-32 pb-16">
          {/* Confetti Layer */}
          <canvas ref={confettiRef} className="pointer-events-none fixed inset-0 z-10" />

          <div className="relative z-20 w-full max-w-4xl mx-auto">
            <div className="text-center">
            <p className="text-gray-700 md:text-lg mb-10 max-w-2xl mx-auto">
              {status === "success" && (message || "Thank you! Your support means a lot.")}
              {status === "loading" && "Please wait while we confirm your payment with our provider."}
              {status === "error" && (message || "We couldn't confirm your payment yet. You can refresh or try again later.")}
            </p>

            {/* Reference intentionally hidden */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center max-w-xl mx-auto">
              <Link href="/">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full">
                  <Home className="h-4 w-4 mr-2" /> Go Home
                </Button>
              </Link>
              <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90 text-white w-full">
                <Receipt className="h-4 w-4 mr-2" /> Refresh Status
              </Button>
            </div>

            {status === "success" && (
              <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-6 rounded-xl bg-green-50 border border-green-100">
                  <div className="flex items-center gap-2 text-green-700 font-semibold mb-1"><Gift className="h-4 w-4" /> Thank You</div>
                  <div className="text-sm text-green-800">Your generosity is making a real impact.</div>
                </div>
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2 text-primary font-semibold mb-1"><Sparkles className="h-4 w-4" /> What’s Next</div>
                  <div className="text-sm text-gray-700">A receipt will be sent to your email shortly.</div>
                </div>
                <div className="p-6 rounded-xl bg-gray-50 border">
                  <div className="font-semibold mb-1">Need Help?</div>
                  <div className="text-sm text-gray-700">If you have any questions, contact support.</div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}



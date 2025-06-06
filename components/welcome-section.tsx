import Image from "next/image"
import FadeIn from "./ui/fade-in"

export default function WelcomeSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ken%201-hXI5KivaxVAed66kGrI92ErEqwBqmf.png"
                  alt="Pastor Ken MBACHI"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary/5 rounded-full -z-10" />
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div>
              <span className="text-sm font-semibold text-primary tracking-wider uppercase">
                A Message From Our Pastor
              </span>
              <h2 className="text-4xl md:text-5xl font-bold my-4">You're Welcome</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                My Name is Ken MBACHI, the lead pastor in Kingdom Ways Living Church International. It's my humble
                pleasure to welcome you to our world.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                It's my pleasure to personally invite you to follow us in any of our live services or social media
                platforms, and you will see what Jesus Christ through His word will make out of your life.
              </p>
              <div className="mt-8">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ksign%201-qPaF6euMuJljlrPezsC26YzQjmqU6C.png"
                  alt="Pastor's Signature"
                  width={180}
                  height={50}
                  className="mb-2"
                />
                <p className="text-slate-800 font-semibold">Ken Mbachi</p>
                <p className="text-slate-500">Lead Pastor</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

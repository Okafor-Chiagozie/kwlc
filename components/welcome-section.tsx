"use client"

import Image from "next/image"

type WelcomeSectionProps = {
  welcomeAddress?: string
}

export default function WelcomeSection({ welcomeAddress }: WelcomeSectionProps) {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>

        <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span>About Our Pastor</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-8 relative">
              <span className="relative inline-block">
                You're Welcome
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full"></span>
              </span>
            </h2>

            <p className="text-gray-600 mb-4 text-lg font-medium">Hello people,</p>

            {welcomeAddress ? (
              <p className="text-gray-700 mb-6 leading-relaxed">
                {welcomeAddress}
              </p>
            ) : (
              <>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  My Name is Ken MBACHI, the lead pastor in Kingdom Ways Living Church International. It's my humble
                  pleasure to welcome you to our world.
                </p>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  In Matthew, Jesus said to Peter fear not just follow me and I will make you... One major assignment of
                  Jesus Christ through His church is the Making of great destinies.
                </p>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  It's my pleasure to personally invite you to follow us in any of our live services, social media platforms
                  and you will see what Jesus Christ through His word will make out of your life. Please enjoy your time in
                  our world and feel very free to use any of our contact points in case you need any information or clarity
                  about us.
                </p>
              </>
            )}

            <p className="text-gray-700 font-medium text-lg mb-8">Welcome! I celebrate you.</p>

            <div className="flex flex-col items-center md:items-start">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ksign%201-qPaF6euMuJljlrPezsC26YzQjmqU6C.png"
                alt="Pastor's Signature"
                width={200}
                height={60}
                className="mb-2 -ml-4"
              />
              <p className="text-gray-800 font-medium">Lead pastor</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-8 border-white shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent z-10"></div>
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 via-transparent to-primary/20 z-0 rounded-full animate-slow-spin"></div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ken%201-hXI5KivaxVAed66kGrI92ErEqwBqmf.png"
                alt="Pastor Ken MBACHI"
                fill
                className="object-contain z-10 relative scale-95 hover:scale-100 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

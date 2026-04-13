"use client"

import { Navbar } from "@/components/navbar"
import { SpeechBubble } from "@/components/speech-bubble"
import { UnitCard } from "@/components/unit-card"
import { Sparkles, MapPin, Star } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const units = [
  {
    title: "البلاد التونسية: السكان",
    subtitle: "درس واحد · خريطتان",
    unitNumber: 1,
    href: "/unit/1/1",
    mapImage: "/population.jpg",
    colorClass: "bg-gradient-to-br from-orange-500 to-red-500",
    hoverDescription: "اكتشف كيف يتوزع التونسيون و كيف يتنقلون",
    hoverImage: "/Dora_photo1.webp"
  },
  {
    title: "الفلاحة والصيد البحري في البلاد التونسية",
    subtitle: "درسان · خريطتان",
    unitNumber: 2,
    href: "/unit/2/1",
    mapImage: "/agriculture.jpg",
    colorClass: "bg-gradient-to-br from-purple-600 to-blue-500",
    hoverDescription: "اكتشف الموارد الفلاحية و الصيد البحري في تونس",
    hoverImage: "/dora2.webp"
  },
  {
    title: "الصناعة بالبلاد التونسية",
    subtitle: "درسان · خريطتان",
    unitNumber: 3,
    href: "/unit/3/1",
    mapImage: "/sine3a.jpg",
    colorClass: "bg-gradient-to-br from-pink-500 to-cyan-500",
    hoverDescription: "اكتشف أهم المناطق والأنشطة الصناعية في تونس",
    hoverImage: "/dora3.webp"
  },
  {
    title: "السياحة بالبلاد التونسية",
    subtitle: "درس واحد · خريطة واحدة",
    unitNumber: 4,
    href: "/unit/4/1",
    mapImage: "/tourist.jpg",
    colorClass: "bg-gradient-to-br from-green-500 to-emerald-600",
    hoverDescription: "اكتشف أجمل الوجهات السياحية في تونس",
    hoverImage: "/dora4.jpg"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image (from /public) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/anime-character-traveling.jpg')" }}
      />
      {/* Overlay to keep text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-primary/30 to-background/90" />

      <div className="relative z-10">
        <Navbar />
      
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Decorative elements */}
            <div className="absolute top-32 right-10 text-secondary/50 animate-bounce-slow hidden lg:block">
              <Star className="w-8 h-8" fill="currentColor" />
            </div>
            <div className="absolute top-48 left-20 text-primary/30 animate-pulse hidden lg:block">
              <MapPin className="w-10 h-10" />
            </div>
          
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Hero Content */}
              <div className="flex-1 text-center lg:text-right space-y-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  السنة السادسة ابتدائي
                </div>
              
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  <span className="text-primary">رحلة</span> في قلب{" "}
                  <span className="relative">
                    الخريطة
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none">
                      <path d="M0 8 Q50 0 100 8 T200 8" stroke="currentColor" strokeWidth="4" fill="none" className="text-secondary" />
                    </svg>
                  </span>
                </h1>
              
                <p className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
                  استكشف جغرافيا تونس بطريقة تفاعلية وممتعة! تعلّم عن السكان والمناخ والهجرة والموارد الطبيعية.
                </p>
              </div>

              {/* Explorer Character with Speech Bubble */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="relative">
                  <div className="relative flex flex-col items-center">
                    <SpeechBubble
                      className={cn(
                        "mb-4 w-[280px] max-w-[90vw] z-20 animate-bounce-slow",
                        "lg:mb-0 lg:absolute lg:top-6 lg:right-full lg:mr-6"
                      )}
                      direction="right"
                    >
                      <p className="text-base font-medium text-center">
                        أهلاً بك يا بطل! أنا دليلك في هذه الرحلة التعليمية. هيا نستكشف تونس معاً!
                      </p>
                    </SpeechBubble>

                    <div className="relative w-44 h-44 md:w-52 md:h-52 animate-float">
                      <Image
                        src="/Dora_photo1.webp"
                        alt="Dora"
                        fill
                        priority
                        className="object-contain drop-shadow-xl"
                        sizes="(min-width: 768px) 208px, 176px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Units Section */}
        <section id="units" className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                الوحدات التعليمية
              </h2>
              <p className="text-lg text-muted-foreground">
                اختر الوحدة التي تريد استكشافها
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {units.map((unit, index) => (
                <UnitCard
                  key={unit.unitNumber}
                  {...unit}
                  delay={index * 150}
                />
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 px-4 bg-white/50">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">عن المشروع</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              تطبيق &quot;تونس الرقمية&quot; هو منصة تعليمية تفاعلية مصممة لتلاميذ السنة السادسة ابتدائي 
              في النظام التعليمي التونسي. يهدف التطبيق إلى تبسيط مادة الجغرافيا وجعلها أكثر متعة 
              من خلال الخرائط التفاعلية والاختبارات الممتعة.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-foreground text-background">
          <div className="container mx-auto max-w-6xl text-center">
            <p className="text-sm opacity-80">
              تونس الرقمية - رحلة في قلب الخريطة © 2026
            </p>
          </div>
        </footer>

        {/* Custom animations */}
        <style jsx global>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
            opacity: 0;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          
          .animate-fade-in {
            animation: fade-in-up 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  )
}

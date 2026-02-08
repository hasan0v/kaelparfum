"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

function AnimatedHero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["cazibədar", "unikal", "əfsanəvi", "premium", "unudulmaz"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-kael-cream via-kael-peach/30 to-kael-cream">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/video/bg-video.webm" type="video/webm" />
        </video>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
      </div>

      {/* Decorative Elements - Optimized: Static transforms instead of continuous pulse animations */}
      <div
        className="absolute top-10 left-10 w-32 h-32 bg-kael-gold/15 rounded-full blur-3xl z-0"
        style={{ transform: 'translate3d(0,0,0)' }}
      />
      <div
        className="absolute bottom-20 right-20 w-48 h-48 bg-kael-rose/15 rounded-full blur-3xl z-0"
        style={{ transform: 'translate3d(0,0,0)' }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-24 h-24 bg-kael-peach/30 rounded-full blur-2xl z-0"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      <div className="container mx-auto relative z-10">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="will-change-transform"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-kael-gold/10 border border-kael-gold/20 text-kael-brown rounded-full text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-kael-gold" />
              Premium Parfüm Kolleksiyası
            </span>
          </motion.div>

          {/* Main Title */}
          <div className="flex gap-4 flex-col">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl max-w-3xl tracking-tight text-center font-heading will-change-transform"
            >
              <span className="text-kael-brown">Özünüzü</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-2">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-bold text-gradient will-change-transform"
                    initial={{ opacity: 0, y: "-100%" }}
                    animate={
                      titleNumber === index
                        ? { y: "0%", opacity: 1 }
                        : { y: titleNumber > index ? "-150%" : "150%", opacity: 0 }
                    }
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <span className="text-kael-brown">hiss etdirin</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl leading-relaxed tracking-tight text-kael-gray max-w-2xl text-center mx-auto will-change-transform"
            >
              Dünyanın ən məşhur brend ətirlərini kəşf edin. Orijinal məhsullar,
              sərfəli qiymətlər və pulsuz çatdırılma ilə premium ətir təcrübəsini yaşayın.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 will-change-transform"
          >
            <Button
              size="lg"
              className="bg-kael-gold hover:bg-kael-brown text-white rounded-full px-8 h-14 text-base font-medium gap-3 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              asChild
            >
              <Link href={ROUTES.products}>
                Kolleksiyaya bax
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-kael-brown text-kael-brown hover:bg-kael-cream rounded-full px-8 h-14 text-base font-medium transition-transform duration-300 hover:scale-105"
              asChild
            >
              <Link href={ROUTES.about}>
                Haqqımızda
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 md:gap-16 mt-8 pt-8 border-t border-kael-brown/10 will-change-transform"
          >
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-heading font-bold text-kael-gold">500+</p>
              <p className="text-sm text-kael-gray mt-1">Ətir çeşidi</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-heading font-bold text-kael-gold">50+</p>
              <p className="text-sm text-kael-gray mt-1">Brend</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-heading font-bold text-kael-gold">100%</p>
              <p className="text-sm text-kael-gray mt-1">Orijinal</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export { AnimatedHero };

"use client"

import Link from "next/link"
import { Menu, Home, Info, BookOpen, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"

export function Navbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-white/90 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 40 50" className="w-6 h-6 text-white">
              {/* Tunisia map silhouette */}
              <path 
                d="M20 2 L25 8 L30 6 L32 12 L28 18 L35 25 L30 35 L25 45 L20 48 L15 45 L10 35 L5 25 L12 18 L8 12 L10 6 L15 8 Z" 
                fill="currentColor"
              />
              <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
          <span className="text-lg font-bold text-foreground hidden sm:block">
            تونس الرقمية
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/10">
              <Home className="w-4 h-4 ml-2" />
              الرئيسية
            </Button>
          </Link>
          <Link href="#about">
            <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/10">
              <Info className="w-4 h-4 ml-2" />
              عن المشروع
            </Button>
          </Link>
          <Link href="#units">
            <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/10">
              <BookOpen className="w-4 h-4 ml-2" />
              الوحدات
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-6 h-6" />
              <span className="sr-only">القائمة</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="text-right text-xl font-bold mb-6">القائمة</SheetTitle>
            <div className="flex flex-col gap-4">
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start text-lg">
                  <Home className="w-5 h-5 ml-3" />
                  الرئيسية
                </Button>
              </Link>
              <Link href="#about">
                <Button variant="ghost" className="w-full justify-start text-lg">
                  <Info className="w-5 h-5 ml-3" />
                  عن المشروع
                </Button>
              </Link>
              <Link href="#units">
                <Button variant="ghost" className="w-full justify-start text-lg">
                  <BookOpen className="w-5 h-5 ml-3" />
                  الوحدات
                </Button>
              </Link>
              <hr className="my-2" />
              <Button variant="ghost" className="w-full justify-start text-lg text-muted-foreground">
                <LogOut className="w-5 h-5 ml-3" />
                الخروج
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

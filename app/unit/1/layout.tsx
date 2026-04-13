import { Unit1MusicScope } from "@/components/unit1-music-scope"

export default function Unit1Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Unit1MusicScope />
      {children}
    </>
  )
}

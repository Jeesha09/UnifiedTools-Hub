import type React from "react"
import "../styles/global.css"
import { ToolProvider } from "@/contexts/ToolContext";
import ToolDialogManager from "@/components/ToolDialogManager";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Innovatrix - All Your Tools in One Place",
  description:
    "A unified platform for developers, designers, students, and professionals with all the tools you need in one place.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={inter.className}>
        <ToolProvider>
          {children}
          <ToolDialogManager />
        </ToolProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}



import './globals.css'
import { ClerkProvider } from "@clerk/nextjs"

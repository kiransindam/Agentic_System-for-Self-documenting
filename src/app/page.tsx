"use client"

import { useState, useTransition, useRef, ChangeEvent, MouseEvent } from "react"
import { Upload, Download, Sparkles, Wand, Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Logo } from "@/components/logo"
import { LoadingSpinner } from "@/components/loading-spinner"
import { generateDocsAction, improveDocsAction } from "./actions"

export default function Home() {
  const [code, setCode] = useState("")
  const [documentation, setDocumentation] = useState("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null);
  const docCardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / (width / 2);
    const y = (e.clientY - top - height / 2) / (height / 2);
    ref.current.style.setProperty('--rotate-y', `${x * 10}deg`);
    ref.current.style.setProperty('--rotate-x', `${-y * 10}deg`);
    ref.current.style.setProperty('--scale', '1.05');
  };

  const handleMouseLeave = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    ref.current.style.setProperty('--rotate-y', '0');
    ref.current.style.setProperty('--rotate-x', '0');
    ref.current.style.setProperty('--scale', '1');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setCode(text)
      }
      reader.readAsText(file)
    }
    // Reset file input to allow uploading the same file again
    if(event.target) {
      event.target.value = ''
    }
  }

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await generateDocsAction(code)
      if ("error" in result) {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: result.error,
        })
      } else {
        setDocumentation(result.documentation)
        toast({
          title: "Documentation Generated",
          description: "Initial documentation is ready for review.",
        })
      }
    })
  }

  const handleImprove = () => {
    startTransition(async () => {
      const result = await improveDocsAction(code, documentation)
      if ("error" in result) {
        toast({
          variant: "destructive",
          title: "Improvement Failed",
          description: result.error,
        })
      } else {
        const newDocumentation = `${documentation}\n\n---\n### AI Suggestions for Improvement\n${result.suggestedImprovements}`;
        setDocumentation(newDocumentation)
        toast({
          title: "Suggestions Received",
          description: "AI suggestions have been added to the documentation.",
        })
      }
    })
  }
  
  const handleExport = (format: "md") => {
    if (!documentation) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There is no documentation to export.",
      })
      return
    }

    const blob = new Blob([documentation], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `documentation.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-grid-slate-900/[0.04] bg-slate-950 text-foreground">
      <header className="flex items-center h-16 px-6 border-b border-white/10 shrink-0 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold font-headline">Coding Documentation</h1>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
        <div 
            className="flex flex-col gap-4 card-3d"
            ref={cardRef}
            onMouseMove={(e) => handleMouseMove(e, cardRef)}
            onMouseLeave={() => handleMouseLeave(cardRef)}
        >
          <Card className="flex-1 flex flex-col min-h-[60vh] bg-transparent border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="text-xl">Your Code</CardTitle>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="bg-white/10 border-white/20 hover:bg-white/20">
                <Upload className="mr-2" />
                Upload File
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".js,.ts,.jsx,.tsx,.py,.go,.rs,.java,.cs,.cpp,.c,.html,.css, .md"
              />
            </CardHeader>
            <CardContent className="flex-1 flex p-0 md:p-4 md:pt-0">
              <Textarea
                placeholder="Paste your code here or upload a file..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-code text-sm flex-1 resize-none bg-black/30 border-white/10 focus-visible:ring-1 focus-visible:ring-primary rounded-lg"
              />
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4 p-4 pt-0">
             <Button onClick={handleGenerate} disabled={isPending || !code} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-purple-500/30 disabled:shadow-none disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed">
              {isPending ? <LoadingSpinner /> : <Sparkles />}
              Generate Docs
            </Button>
             <Button onClick={handleImprove} disabled={isPending || !documentation} variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg shadow-sky-500/10 disabled:shadow-none disabled:bg-gray-500/20 disabled:text-gray-400 disabled:border-gray-500/30 disabled:cursor-not-allowed">
              {isPending ? <LoadingSpinner /> : <Wand />}
              Improve
            </Button>
          </div>
        </div>

        <div 
            className="flex flex-col gap-4 card-3d"
            ref={docCardRef}
            onMouseMove={(e) => handleMouseMove(e, docCardRef)}
            onMouseLeave={() => handleMouseLeave(docCardRef)}
        >
          <Card className="flex-1 flex flex-col min-h-[60vh] bg-transparent border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">AI-Generated Documentation</CardTitle>
                {isPending && <LoadingSpinner />}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleExport("md")} disabled={isPending || !documentation} className="hover:bg-white/10 disabled:text-gray-500">
                <Download className="mr-2" />
                Export MD
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex p-0 md:p-4 md:pt-0">
              <Textarea
                placeholder="Your generated documentation will appear here..."
                value={documentation}
                onChange={(e) => setDocumentation(e.target.value)}
                className="font-code text-sm flex-1 resize-none bg-black/30 border-white/10 focus-visible:ring-1 focus-visible:ring-primary rounded-lg"
              />
            </CardContent>
          </Card>
          <div className="flex items-center justify-center p-2 rounded-md mx-4 mb-2 bg-black/20">
            <p className="text-xs text-muted-foreground">
              You can edit the documentation directly in this text area before exporting.
            </p>
          </div>
        </div>
      </main>
      <footer className="py-8 px-4 text-center text-muted-foreground">
        <p className="mb-4">Created by Kiransindam</p>
        <div className="flex justify-center items-center gap-6">
            <a href="https://www.linkedin.com/in/your-linkedin-profile" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Linkedin size={20} />
                LinkedIn
            </a>
            <a href="https://github.com/your-github-profile" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Github size={20} />
                GitHub
            </a>
        </div>
      </footer>
    </div>
  )
}

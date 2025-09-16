"use client"

import { useState, useTransition, useRef, ChangeEvent } from "react"
import { Upload, Download, Sparkles, Wand } from "lucide-react"
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="flex items-center h-16 px-6 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold font-headline">CodeMaestro</h1>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
        <div className="flex flex-col gap-4">
          <Card className="flex-1 flex flex-col min-h-[60vh]">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <CardTitle className="text-xl">Your Code</CardTitle>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
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
                className="font-code text-sm flex-1 resize-none bg-muted/20 border-0 focus-visible:ring-1 focus-visible:ring-primary rounded-t-none"
              />
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4">
             <Button onClick={handleGenerate} disabled={isPending || !code} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isPending ? <LoadingSpinner /> : <Sparkles />}
              Generate Docs
            </Button>
             <Button onClick={handleImprove} disabled={isPending || !documentation} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {isPending ? <LoadingSpinner /> : <Wand />}
              Improve
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="flex-1 flex flex-col min-h-[60vh]">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">AI-Generated Documentation</CardTitle>
                {isPending && <LoadingSpinner />}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleExport("md")} disabled={isPending || !documentation}>
                <Download className="mr-2" />
                Export MD
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex p-0 md:p-4 md:pt-0">
              <Textarea
                placeholder="Your generated documentation will appear here..."
                value={documentation}
                onChange={(e) => setDocumentation(e.target.value)}
                className="font-code text-sm flex-1 resize-none bg-muted/20 border-0 focus-visible:ring-1 focus-visible:ring-primary rounded-t-none"
              />
            </CardContent>
          </Card>
          <div className="flex items-center justify-center p-2 rounded-md bg-muted/30">
            <p className="text-xs text-muted-foreground">
              You can edit the documentation directly in this text area before exporting.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

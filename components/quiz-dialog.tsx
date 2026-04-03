"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Confetti } from "./confetti"
import { ExplorerCharacter } from "./explorer-character"

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
}

interface QuizDialogProps {
  questions: QuizQuestion[]
  title?: string
  children: React.ReactNode
}

export function QuizDialog({ questions, title = "اختبر معلوماتك", children }: QuizDialogProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [answered, setAnswered] = useState(false)

  const handleAnswer = (index: number) => {
    if (answered) return
    setSelectedAnswer(index)
    setAnswered(true)
    
    if (index === questions[currentQuestion].correctIndex) {
      setScore(score + 1)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setAnswered(false)
  }

  const getOptionStyle = (index: number) => {
    if (!answered) {
      return "bg-white hover:bg-primary/10 border-2 border-muted hover:border-primary"
    }
    if (index === questions[currentQuestion].correctIndex) {
      return "bg-green-100 border-2 border-green-500 text-green-800"
    }
    if (index === selectedAnswer && index !== questions[currentQuestion].correctIndex) {
      return "bg-red-100 border-2 border-red-500 text-red-800"
    }
    return "bg-gray-100 border-2 border-gray-200 text-gray-500"
  }

  return (
    <>
      <Confetti active={showConfetti} />
      <Dialog onOpenChange={(open) => { if (!open) resetQuiz() }}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-primary flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6" />
              {title}
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              أجب على الأسئلة التالية لاختبار معلوماتك
            </DialogDescription>
          </DialogHeader>

          {!showResult ? (
            <div className="space-y-6 py-4">
              {/* Progress */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>السؤال {currentQuestion + 1} من {questions.length}</span>
                <span>النقاط: {score}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <div className="bg-primary/5 rounded-2xl p-6">
                <p className="text-xl font-semibold text-foreground text-center leading-relaxed">
                  {questions[currentQuestion].question}
                </p>
              </div>

              {/* Options */}
              <div className="grid gap-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={answered}
                    className={cn(
                      "p-4 rounded-xl text-lg font-medium transition-all duration-300",
                      "flex items-center justify-between",
                      getOptionStyle(index)
                    )}
                  >
                    <span>{option}</span>
                    {answered && index === questions[currentQuestion].correctIndex && (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    )}
                    {answered && index === selectedAnswer && index !== questions[currentQuestion].correctIndex && (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Next button */}
              {answered && (
                <Button 
                  onClick={nextQuestion}
                  className="w-full py-6 text-lg rounded-xl animate-fade-in"
                >
                  {currentQuestion < questions.length - 1 ? "السؤال التالي" : "عرض النتيجة"}
                </Button>
              )}
            </div>
          ) : (
            <div className="py-8 text-center space-y-6">
              <ExplorerCharacter size="lg" waving className="mx-auto" />
              
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">
                  {score === questions.length ? "ممتاز!" : score >= questions.length / 2 ? "أحسنت!" : "حاول مرة أخرى"}
                </h3>
                <p className="text-xl text-muted-foreground">
                  حصلت على {score} من {questions.length} نقاط
                </p>
              </div>

              {/* Score visual */}
              <div className="flex justify-center gap-2">
                {Array.from({ length: questions.length }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-8 h-8 rounded-full",
                      i < score ? "bg-green-500" : "bg-red-300"
                    )}
                  />
                ))}
              </div>

              <Button 
                onClick={resetQuiz}
                variant="outline"
                className="py-6 px-8 text-lg rounded-xl"
              >
                <RotateCcw className="w-5 h-5 ml-2" />
                إعادة الاختبار
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

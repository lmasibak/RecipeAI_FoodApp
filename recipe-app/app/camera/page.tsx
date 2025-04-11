"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, ChevronLeft, Loader2 } from "lucide-react"
import { identifyIngredients } from "@/lib/ingredient-recognition"

export default function CameraPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [identifiedIngredients, setIdentifiedIngredients] = useState<string[]>([])
  const [cameraError, setCameraError] = useState<string | null>(null)

  useEffect(() => {
    if (cameraActive) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [cameraActive])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraError(null)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setCameraError("Could not access camera. Please check permissions.")
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    setProcessing(true)

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Simulate ingredient recognition (in a real app, this would use ML)
    setTimeout(() => {
      const ingredients = identifyIngredients()
      setIdentifiedIngredients(ingredients)
      setProcessing(false)
      setCameraActive(false)
    }, 1500)
  }

  const findRecipes = () => {
    // In a real app, we would pass these ingredients to the recipe search
    router.push(`/suggestions?ingredients=${identifiedIngredients.join(",")}`)
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Ingredient Scanner</h1>
      </div>

      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0 relative">
          {cameraActive ? (
            <>
              <video ref={videoRef} autoPlay playsInline className="w-full aspect-[4/3] bg-gray-100" />
              <canvas ref={canvasRef} className="hidden" />

              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <Button
                  onClick={captureImage}
                  className="rounded-full w-16 h-16 bg-white border-4 border-teal-500"
                  disabled={processing}
                >
                  {processing ? (
                    <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-teal-500" />
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full aspect-[4/3] bg-gray-100 flex flex-col items-center justify-center p-6">
              {cameraError ? (
                <div className="text-center">
                  <p className="text-red-500 mb-4">{cameraError}</p>
                  <Button onClick={() => setCameraActive(true)}>Try Again</Button>
                </div>
              ) : identifiedIngredients.length > 0 ? (
                <div className="w-full">
                  <h3 className="font-medium text-lg mb-4">Identified Ingredients:</h3>
                  <ul className="space-y-2">
                    {identifiedIngredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center p-2 bg-teal-50 rounded-md">
                        <div className="w-3 h-3 rounded-full bg-teal-500 mr-3"></div>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <Camera className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center mb-4">
                    Point your camera at ingredients to identify them and get recipe suggestions
                  </p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {!cameraActive && (
        <div className="space-y-4">
          {identifiedIngredients.length > 0 ? (
            <Button onClick={findRecipes} className="w-full bg-teal-600 hover:bg-teal-700">
              Find Recipes with These Ingredients
            </Button>
          ) : (
            <Button onClick={() => setCameraActive(true)} className="w-full bg-teal-600 hover:bg-teal-700">
              {cameraError ? "Try Again" : "Start Scanning"}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

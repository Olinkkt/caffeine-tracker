'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCaffeineIntakes, CaffeineIntake } from '@/lib/caffeineStorage'
import { Progress } from "@/components/ui/progress"
import { 
  Bomb, Flame, Zap, Rocket, 
  Sparkles, Star, PartyPopper, 
  Skull, Coffee, Dumbbell, 
  Droplet, Atom, Beef,
  FlaskConical
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { clearCaffeineIntakes } from '@/lib/caffeineStorage'
import { DRINK_MAPPINGS, getIcon } from '@/lib/constants'

// Přidáme helper pro suggestions při zadávání
export const getDrinkSuggestions = (input: string): string[] => {
  const lowercaseInput = input.toLowerCase()
  const suggestions: string[] = []

  for (const [drinkName, config] of Object.entries(DRINK_MAPPINGS)) {
    if (drinkName.includes(lowercaseInput)) {
      suggestions.push(drinkName)
    }
    config.aliases.forEach(alias => {
      if (alias.includes(lowercaseInput)) {
        suggestions.push(alias)
      }
    })
  }

  return suggestions.slice(0, 5) // Vrátíme max 5 suggestions
}

// A přidáme helper pro získání množství kofeinu
export const getDefaultCaffeine = (name: string): number => {
  const lowercaseName = name.toLowerCase()
  
  // Default caffeine amounts (in mg)
  const CAFFEINE_AMOUNTS = {
    'espresso': 63,
    'double espresso': 126,
    'coffee': 95,
    'cold brew': 200,
    'red bull': 80,
    'monster': 160,
    'tiger': 80,
    'veiny galaxy': 470,
    'gorilla mode': 200,
    'c4': 200,
    'tea': 50,
    'yerba mate': 85
  }

  for (const [drinkName, amount] of Object.entries(CAFFEINE_AMOUNTS)) {
    if (lowercaseName.includes(drinkName)) {
      return amount
    }
  }

  return 0 // Default pokud nenajdem match
}

const getBeastModeMessage = (percentage: number) => {
  if (percentage <= 100) return "BEAST MODE ACTIVATED! 🔥🔥🔥"
  
  const messages = [
    // 100-110%
    [
      "POWER RISING! 📈",
      "GETTING STRONGER! 💪",
      "ENERGY SURGING! ⚡️",
    ],
    // 110-120%
    [
      "BEAST MODE INTENSIFYING! 🔥",
      "POWER LEVEL CLIMBING! 🚀",
      "UNSTOPPABLE MODE: ON! ⚡️",
    ],
    // 120-140%
    [
      "ABSOLUTELY CRUSHING IT! 💪💥",
      "POWER LEVEL: INSANE! 🌟",
      "MAXIMUM OVERDRIVE! 🏃‍♂️💨",
    ],
    // 140-160%
    [
      "GOING SUPER SAIYAN! 💫✨",
      "ULTRA INSTINCT UNLOCKED! 🌟",
      "BREAKING HUMAN LIMITS! 🔥",
    ],
    // 160-180%
    [
      "TRANSCENDING HUMANITY! 👾",
      "REALITY BENDING! 🌌",
      "COSMIC POWER UNLOCKED! 🎇",
    ],
    // 180-200%
    [
      "ASCENDING TO GODHOOD! 🎇",
      "BEYOND MORTAL LIMITS! 💫",
      "REALITY GLITCHING! ⚡️🌀",
    ],
    // 200%+
    [
      "E̷R̷R̷O̷R̷:̷ ̷T̷O̷O̷ ̷M̷U̷C̷H̷ ̷P̷O̷W̷E̷R̷!̷ 🤯",
      "S̸Y̸S̸T̸E̸M̸ ̸O̸V̸E̸R̸L̸O̸A̸D̸!̸ ⚠️",
      "R̶E̶A̶L̶I̶T̶Y̶.̶E̶X̶E̶ ̶H̶A̶S̶ ̶C̶R̶A̶S̶H̶E̶D̶!̶ 💀",
    ]
  ]

  // Calculate level based on 10% increments over 100%
  const level = Math.min(Math.floor((percentage - 100) / 10), messages.length - 1)
  const options = messages[level]
  
  // Change message every 3 seconds for extra CRAZY effect!
  const messageIndex = Math.floor(Date.now() / 3000) % options.length
  return options[messageIndex]
}

const getCrazyStyles = (percentage: number) => {
  // Base styles
  if (percentage <= 100) {
    return {
      messageClass: "text-primary font-bold",
      textClass: "",
      cardClass: ""
    }
  }

  // Going crazy (100-150%)
  if (percentage <= 150) {
    return {
      messageClass: "animate-bounce text-primary font-bold",
      textClass: "animate-pulse",
      cardClass: "animate-pulse"
    }
  }

  // Super crazy (150-200%)
  if (percentage <= 200) {
    return {
      messageClass: "animate-glitch text-red-500 font-extrabold",
      textClass: "animate-wiggle",
      cardClass: "animate-rgb-shadow"
    }
  }

  // ULTRA INSANE (200%+)
  return {
    messageClass: "animate-mega-glitch text-red-500 font-black uppercase",
    textClass: "animate-shake",
    cardClass: "animate-rgb-shadow-intense"
  }
}

export function Dashboard() {
  const [intakes, setIntakes] = useState<CaffeineIntake[]>([])
  const dailyLimit = 288 // The beast mode limit! 🔥

  useEffect(() => {
    const loadIntakes = () => {
      const todayIntakes = getCaffeineIntakes()
      setIntakes(todayIntakes)
    }

    loadIntakes()
    window.addEventListener('storage', loadIntakes)
    return () => window.removeEventListener('storage', loadIntakes)
  }, [])

  const totalCaffeine = intakes.reduce((sum, intake) => sum + intake.amount, 0)
  const progressPercentage = (totalCaffeine / dailyLimit) * 100

  const getProgressColor = () => {
    if (progressPercentage < 50) return 'from-[hsl(var(--progress-low))] to-[hsl(var(--progress-low))]'
    if (progressPercentage < 75) return 'from-[hsl(var(--progress-medium))] to-[hsl(var(--progress-high))]'
    if (progressPercentage < 100) return 'from-[hsl(var(--progress-high))] to-[hsl(var(--progress-max))]'
    return 'from-[hsl(var(--progress-max))] to-[hsl(var(--destructive))]'
  }

  const handleReset = () => {
    clearCaffeineIntakes()
    setIntakes([])
    toast({
      title: "Day Reset! 🧹",
      description: "Starting fresh! Time to power up again! 💪",
      variant: "destructive",
    })
  }

  const handleDeleteIntake = (index: number) => {
    const newIntakes = [...intakes];
    newIntakes.splice(index, 1);
    localStorage.setItem('caffeineIntakes', JSON.stringify(newIntakes));
    setIntakes(newIntakes);
    
    toast({
      title: "Power-Up Deleted! 🗑️",
      description: "Keeping that power level in check! 💪",
      variant: "destructive",
    })
  }

  const styles = getCrazyStyles(progressPercentage)

  return (
    <div className="space-y-6 w-full [perspective:1000px]">
      <Card className={`border-2 border-primary/20 shadow-lg hover:shadow-2xl 
        transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden 
        group ${styles.cardClass}`}>
        <CardHeader className="pb-2">
          <CardTitle className={`flex items-center text-2xl group-hover:[transform:translateZ(20px)] 
            transition-transform ${styles.textClass}`}>
            {progressPercentage >= 100 ? (
              <Skull className={`mr-2 text-red-500 ${progressPercentage > 200 ? 'animate-spin-glow' : 'animate-pulse'}`} />
            ) : (
              <Rocket className="mr-2 text-yellow-500 group-hover:rotate-12 transition-transform" />
            )}
            <span className={`bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent
              ${progressPercentage > 150 ? 'animate-text-flicker' : ''}`}>
              Power Level
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-8 group-hover:[transform:translateZ(30px)] transition-transform">
            <p className="text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {totalCaffeine}
              <span className="text-4xl ml-2">mg</span>
            </p>
          </div>

          <div className="relative h-4 w-full rounded-full overflow-hidden bg-muted/30 p-[2px] group-hover:[transform:translateZ(20px)] transition-transform">
            <div 
              className={`absolute top-[2px] left-[2px] h-[calc(100%-4px)] bg-gradient-to-r ${getProgressColor()} 
              transition-all duration-1000 ease-out rounded-full backdrop-blur-sm`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className={`text-sm mt-3 transition-all duration-300 ${styles.messageClass}`}>
            {dailyLimit - totalCaffeine > 0 
              ? `${dailyLimit - totalCaffeine} mg till BEAST MODE! 💪`
              : getBeastModeMessage(progressPercentage)}
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 hover:shadow-xl transition-all duration-300 
        rounded-xl overflow-hidden group hover:[transform:rotateY(-5deg)] hover:shadow-[0_0_30px_rgba(var(--secondary),0.15)]">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coffee className="mr-2 text-primary animate-spin-slow" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Today's Power-Ups
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {intakes.length > 0 ? (
            <ul className="space-y-3">
              {intakes.map((intake, index) => {
                const Icon = getIcon(intake.name)
                return (
                  <li 
                    key={index} 
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-accent/10 
                    transition-all duration-300 group hover:scale-[1.02] hover:shadow-md"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideIn 0.5s ease-out forwards'
                    }}
                  >
                    <span className="flex items-center">
                      <Icon 
                        className={`mr-2 transition-all duration-300
                          ${intake.name.toLowerCase().includes('red bull') ? 'text-blue-500 group-hover:animate-rocket' : ''}
                          ${intake.name.toLowerCase().includes('monster') ? 'text-green-500 group-hover:animate-zap' : ''}
                          ${intake.name.toLowerCase().includes('pre-workout') ? 'text-purple-500 group-hover:animate-atom' : ''}
                          ${intake.name.toLowerCase().includes('espresso') ? 'text-yellow-500 group-hover:animate-bomb' : ''}
                          group-hover:scale-125 group-hover:rotate-12`} 
                          size={18} 
                        />
                      <span className="group-hover:text-primary transition-colors">
                        {intake.name}
                      </span>
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {intake.amount} mg
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteIntake(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 glitch-hover"
                      >
                        <Bomb className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground animate-pulse text-center py-4">
              No power-ups yet? Time to fuel up! ⚡️
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


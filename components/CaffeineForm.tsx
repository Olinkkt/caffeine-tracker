'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addCaffeineIntake } from '@/lib/caffeineStorage'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Zap } from 'lucide-react'
import { DRINK_MAPPINGS, getIcon } from '@/lib/constants'

export function CaffeineForm() {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [volume, setVolume] = useState('')
  const [time, setTime] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    const now = new Date()
    const formattedDate = now.toISOString().slice(0, 16)
    setTime(formattedDate)
  }, [])

  useEffect(() => {
    if (name && volume) {
      const lowercaseName = name.toLowerCase()
      for (const [drinkName, config] of Object.entries(DRINK_MAPPINGS)) {
        if (
          lowercaseName.includes(drinkName) || 
          config.aliases.some(alias => lowercaseName.includes(alias))
        ) {
          // Calculate based on type
          const caffeineAmount = config.isPowder && config.caffeinePerGram
            ? Math.round(parseFloat(volume) * config.caffeinePerGram)
            : Math.round(parseFloat(volume) * config.caffeinePerMl)
          
          setAmount(caffeineAmount.toString())
          break
        }
      }
    }
  }, [name, volume])

  // Add new useEffect for auto-fill on exact match
  useEffect(() => {
    if (name) {
      const lowercaseName = name.toLowerCase()
      for (const [drinkName, config] of Object.entries(DRINK_MAPPINGS)) {
        if (
          drinkName === lowercaseName || 
          config.aliases.some(alias => alias === lowercaseName)
        ) {
          // We have an exact match, auto-fill values
          setVolume(config.defaultVolume.toString())
          const caffeineAmount = config.isPowder && config.caffeinePerGram
            ? Math.round(config.defaultVolume * config.caffeinePerGram)
            : Math.round(config.defaultVolume * config.caffeinePerMl)
          setAmount(caffeineAmount.toString())
          break
        }
      }
    }
  }, [name])

  useEffect(() => {
    if (name) {
      const lowercaseInput = name.toLowerCase()
      const newSuggestions: string[] = []
      
      // Check if we have an exact match first
      const exactMatch = Object.entries(DRINK_MAPPINGS).some(([drinkName, config]) => {
        return drinkName === lowercaseInput || 
               config.aliases.some(alias => alias === lowercaseInput)
      })

      // If we have an exact match, don't show suggestions
      if (exactMatch) {
        setSuggestions([])
        return
      }
      
      // Otherwise, show filtered suggestions
      for (const [drinkName, config] of Object.entries(DRINK_MAPPINGS)) {
        if (drinkName.includes(lowercaseInput)) {
          newSuggestions.push(drinkName)
        }
        config.aliases.forEach(alias => {
          if (alias.includes(lowercaseInput)) {
            newSuggestions.push(alias)
          }
        })
      }
      
      setSuggestions(newSuggestions.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [name])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && amount && time) {
      addCaffeineIntake({
        name,
        amount: parseInt(amount),
        time: new Date(time).toISOString(),
      })
      setName('')
      setAmount('')
      setVolume('')

      const messages = [
        "You're absolutely crushing it! 💪",
        "Another power-up added! Let's gooo! 🚀",
        "Beast mode loading... 🔥",
        "Caffeine level increasing! ⚡️",
        "Power level over 9000! 💫",
      ]
      const randomMsg = messages[Math.floor(Math.random() * messages.length)]

      toast({
        title: "Power-Up Added! 🎯",
        description: randomMsg,
        variant: "default",
        className: "bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20",
      })
    }
  }

  const Icon = getIcon(name)

  const getVolumeLabel = () => {
    const lowercaseName = name.toLowerCase()
    for (const [drinkName, config] of Object.entries(DRINK_MAPPINGS)) {
      if (
        lowercaseName.includes(drinkName) || 
        config.aliases.some(alias => lowercaseName.includes(alias))
      ) {
        return config.isPowder ? 'Amount (g)' : 'Volume (ml)'
      }
    }
    return 'Volume (ml)'
  }

  const handleSuggestionClick = (suggestion: string) => {
    console.log('🎯 Suggestion clicked:', suggestion)
    setName(suggestion)
    setSuggestions([])
    
    // Najdeme správný drink a nastavíme hodnoty
    for (const [drinkName, config] of Object.entries(DRINK_MAPPINGS)) {
      if (
        suggestion.toLowerCase().includes(drinkName) || 
        config.aliases.some(alias => suggestion.toLowerCase().includes(alias))
      ) {
        console.log('🎯 Found drink:', drinkName, config)
        setVolume(config.defaultVolume.toString())
        
        // Calculate caffeine based on type
        const caffeineAmount = config.isPowder && config.caffeinePerGram
          ? Math.round(config.defaultVolume * config.caffeinePerGram)
          : Math.round(config.defaultVolume * config.caffeinePerMl)
        
        setAmount(caffeineAmount.toString())
        break
      }
    }
  }

  return (
    <Card className="w-full mt-4 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center text-2xl">
          <Zap className="mr-2 text-yellow-500" />
          Add New Power-Up
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Drink Name</Label>
            <div className="relative">
              <div className="flex items-center relative">
                <Icon className="absolute left-3 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    // Reset volume and amount when name changes
                    setVolume('')
                    setAmount('')
                  }}
                  onBlur={() => {
                    // Give suggestions time to handle click before closing
                    setTimeout(() => setSuggestions([]), 200)
                  }}
                  className="pl-10"
                  placeholder="What's your poison? ☕️"
                  required
                />
              </div>
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-accent/10 cursor-pointer transition-colors focus:outline-none"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSuggestionClick(suggestion)
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="volume">{getVolumeLabel()}</Label>
            <Input
              id="volume"
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder={`How much are you taking? ${name.toLowerCase().includes('veiny') ? '🧂' : '🥤'}`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Caffeine Amount (mg)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Automatically calculated! 🧮"
              className="bg-muted/50"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary transition-all duration-300">
            <Zap className="mr-2 h-4 w-4" />
            Add Power-Up
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


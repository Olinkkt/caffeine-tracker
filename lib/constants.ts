import { 
  Bomb, Flame, Zap, Rocket, 
  Sparkles, Star, PartyPopper, 
  Skull, Coffee, Dumbbell, 
  Droplet, Atom, Beef,
  FlaskConical
} from 'lucide-react'

export type DrinkConfig = {
  icon: any;
  aliases: string[];
  caffeinePerMl: number;
  defaultVolume: number;
  isPowder?: boolean;
  caffeinePerGram?: number;
}

export const DRINK_MAPPINGS: Record<string, DrinkConfig> = {
  // Energy Drinks 🚀
  'red bull': { icon: Rocket, aliases: ['redbull', 'red-bull'], caffeinePerMl: 0.32, defaultVolume: 250 },
  'monster': { icon: FlaskConical, aliases: ['monster energy'], caffeinePerMl: 0.32, defaultVolume: 500 },
  'tiger': { icon: Beef, aliases: ['tiger energy'], caffeinePerMl: 0.32, defaultVolume: 250 },

  // Pre-workouts 💪
  'veiny galaxy': { 
    icon: Atom, 
    aliases: ['pre-workout', 'preworkout', 'veiny', 'galaxy'], 
    caffeinePerMl: 0,
    defaultVolume: 20,
    isPowder: true,
    caffeinePerGram: 23.5
  },
  'gorilla mode': { icon: Dumbbell, aliases: ['gorilla', 'mode'], caffeinePerMl: 0.8, defaultVolume: 250 },
  'c4': { icon: Bomb, aliases: ['c4 energy', 'c4 pre'], caffeinePerMl: 0.8, defaultVolume: 250 },

  // Coffee & Tea ☕️
  'espresso': { icon: Bomb, aliases: ['double espresso', 'triple espresso'], caffeinePerMl: 2.1, defaultVolume: 30 },
  'coffee': { icon: Flame, aliases: ['americano', 'latte', 'cappuccino', 'flat white'], caffeinePerMl: 0.4, defaultVolume: 250 },
  'cold brew': { icon: Droplet, aliases: ['nitro brew', 'cold coffee'], caffeinePerMl: 0.8, defaultVolume: 350 },
  'tea': { icon: Sparkles, aliases: ['green tea', 'black tea', 'matcha'], caffeinePerMl: 0.2, defaultVolume: 250 },
  'yerba mate': { icon: Star, aliases: ['mate', 'yerba', 'club mate'], caffeinePerMl: 0.34, defaultVolume: 330 }
}

export const getIcon = (name: string) => {
  const lowercaseName = name.toLowerCase()
  
  for (const [drinkName, config] of Object.entries(DRINK_MAPPINGS)) {
    if (
      lowercaseName.includes(drinkName) || 
      config.aliases.some(alias => lowercaseName.includes(alias))
    ) {
      return config.icon
    }
  }

  return PartyPopper
} 
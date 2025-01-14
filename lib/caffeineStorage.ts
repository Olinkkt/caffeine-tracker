export interface CaffeineIntake {
  name: string;
  amount: number;
  time: string;
}

const STORAGE_KEY = 'caffeineIntakes';

export function addCaffeineIntake(intake: CaffeineIntake): void {
  const intakes = getCaffeineIntakes();
  intakes.push(intake);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(intakes));
  window.dispatchEvent(new Event('storage'));
}

export function getCaffeineIntakes(): CaffeineIntake[] {
  const today = new Date().toDateString();
  const storedIntakes = localStorage.getItem(STORAGE_KEY);
  if (!storedIntakes) return [];

  const allIntakes: CaffeineIntake[] = JSON.parse(storedIntakes);
  return allIntakes.filter(intake => new Date(intake.time).toDateString() === today);
}

export const clearCaffeineIntakes = () => {
  localStorage.removeItem('caffeineIntakes')
  window.dispatchEvent(new Event('storage'))
}


import { DiceRollResult } from '@/types/dice';

export function parseAndRoll(
  input: string,
  defaultLabel: string = 'Rolagem de Dado'
): DiceRollResult | null {
  const trimmed = input.trim();
  const regex = /^(?:\/(?:roll|r)\s+)?(?:(\d*)d(\d+))(?:([+-])(\d+))?(?:\s+(.+))?$/i;
  const match = trimmed.match(regex);

  if (!match) return null;

  const diceCount = match[1] ? parseInt(match[1], 10) : 1;
  const diceFaces = parseInt(match[2], 10);
  const sign = match[3] || '+';
  const rawMod = match[4] ? parseInt(match[4], 10) : 0;
  const modifier = sign === '-' ? -rawMod : rawMod;
  const actionName = match[5]?.trim() || defaultLabel;

  if (diceCount < 1 || diceCount > 100 || diceFaces < 2 || diceFaces > 1000) {
    return null;
  }

  const individualRolls: number[] = [];
  for (let i = 0; i < diceCount; i++) {
    individualRolls.push(Math.floor(Math.random() * diceFaces) + 1);
  }

  const sumRolls = individualRolls.reduce((acc, val) => acc + val, 0);
  const total = sumRolls + modifier;

  const isD20 = diceCount === 1 && diceFaces === 20;
  const isCriticalSuccess = isD20 && individualRolls[0] === 20;
  const isCriticalFail = isD20 && individualRolls[0] === 1;

  const modString = modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : '';
  const formula = `${diceCount}d${diceFaces}${modString}`;

  return {
    formula,
    actionName,
    diceCount,
    diceFaces,
    individualRolls,
    modifier,
    total,
    isCriticalSuccess,
    isCriticalFail,
  };
}

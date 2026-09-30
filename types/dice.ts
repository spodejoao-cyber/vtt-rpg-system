export interface DiceRollResult {
  formula: string;
  actionName: string;
  diceCount: number;
  diceFaces: number;
  individualRolls: number[];
  modifier: number;
  total: number;
  isCriticalSuccess: boolean;
  isCriticalFail: boolean;
}

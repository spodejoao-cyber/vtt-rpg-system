export type CharacterClass = 'Guerreiro' | 'Mago' | 'Ladino' | 'Clérigo' | 'Bárbaro' | 'Bardo';
export type CharacterRace = 'Humano' | 'Elfo' | 'Anão' | 'Halfling' | 'Draconato' | 'Tiefling';

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CharacterData {
  name: string;
  race: CharacterRace;
  characterClass: CharacterClass;
  background: string;
  alignment: string;
  stats: AbilityScores;
  selectedSkills: string[];
  hp: number;
  maxHp: number;
  armorClass: number;
}

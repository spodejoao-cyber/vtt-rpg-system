'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Token {
  id: string;
  campaign_id: string;
  name: string;
  x: number;
  y: number;
  type: 'player' | 'enemy' | 'npc';
  imageUrl?: string;
  hp: number;
  max_hp: number;
  speed: number;
}

interface TacticalMapProps {
  campaignId: string;
  gridSize?: { width: number; height: number };
}

export default function TacticalMap({ campaignId, gridSize = { width: 12, height: 8 } }: TacticalMapProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      const { data } = await supabase
        .from('tokens')
        .select('*')
        .eq('campaign_id', campaignId);
      if (data) setTokens(data as Token[]);
    };

    fetchTokens();

    const channel = supabase
      .channel(`map_updates_${campaignId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tokens', filter: `campaign_id=eq.${campaignId}` },
        (payload) => {
          const updatedToken = payload.new as Token;
          setTokens((prev) => prev.map((t) => (t.id === updatedToken.id ? updatedToken : t)));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [campaignId]);

  const selectedToken = tokens.find((t) => t.id === selectedTokenId);
  const getTokenAt = (x: number, y: number) => tokens.find((t) => t.x === x && t.y === y);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
  };

  const handleCellClick = async (x: number, y: number) => {
    const clickedToken = getTokenAt(x, y);

    if (clickedToken) {
      setSelectedTokenId(selectedTokenId === clickedToken.id ? null : clickedToken.id);
      return;
    }

    if (selectedToken) {
      const distance = calculateDistance(selectedToken.x, selectedToken.y, x, y);
      if (distance <= selectedToken.speed) {
        setTokens((prev) => prev.map((t) => (t.id === selectedToken.id ? { ...t, x, y } : t)));
        setSelectedTokenId(null);

        await supabase.from('tokens').update({ x, y }).eq('id', selectedToken.id);
      }
    }
  };

  const cells = [];
  for (let y = 0; y < gridSize.height; y++) {
    for (let x = 0; x < gridSize.width; x++) {
      cells.push({ x, y });
    }
  }

  return (
    <div className="w-full max-w-5xl bg-[#0a0c12]/95 border border-gray-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
      <div className="relative overflow-auto border-2 border-gray-800/80 rounded-xl bg-[#07090e]">
        <div 
          className="relative grid gap-[1px] p-2"
          style={{
            gridTemplateColumns: `repeat(${gridSize.width}, minmax(64px, 1fr))`,
            gridTemplateRows: `repeat(${gridSize.height}, minmax(64px, 1fr))`,
          }}
        >
          {cells.map((cell) => {
            const token = getTokenAt(cell.x, cell.y);
            const isSelected = token?.id === selectedTokenId;
            let isReachable = false;

            if (selectedToken && !token) {
              const distance = calculateDistance(selectedToken.x, selectedToken.y, cell.x, cell.y);
              isReachable = distance > 0 && distance <= selectedToken.speed;
            }

            return (
              <div
                key={`${cell.x}-${cell.y}`}
                onClick={() => handleCellClick(cell.x, cell.y)}
                className={`relative w-16 h-16 border border-white/5 flex items-center justify-center ${
                  isReachable ? 'bg-emerald-500/10 border-emerald-500/30 cursor-pointer' : ''
                }`}
              >
                {token && (
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'ring-4 ring-amber-400' : ''
                  }`}>
                    <span className="text-white font-bold">{token.name.slice(0, 2)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

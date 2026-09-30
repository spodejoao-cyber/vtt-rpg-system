CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Campanhas
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  fog_of_war BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Tabela de Tokens do Mapa
CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  type TEXT NOT NULL,
  hp INTEGER NOT NULL,
  max_hp INTEGER NOT NULL,
  speed INTEGER NOT NULL,
  image_url TEXT
);

-- Tabela de Eventos e Chat
CREATE TABLE room_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('chat', 'roll', 'system')),
  content TEXT NOT NULL,
  roll_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Pub/Sub Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE tokens;
ALTER PUBLICATION supabase_realtime ADD TABLE room_events;

-- Ativacao do Row Level Security (RLS)
ALTER TABLE room_events ENABLE ROW LEVEL SECURITY;

-- Politicas RLS
CREATE POLICY "Leitura restrita a membros da sala"
ON room_events FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM room_members
    WHERE room_members.room_id = room_events.room_id
      AND room_members.user_id = auth.uid()
  )
);

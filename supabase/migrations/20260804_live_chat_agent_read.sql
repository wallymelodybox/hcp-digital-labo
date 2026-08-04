alter table public.chat_conversations
  add column if not exists agent_last_read_at timestamptz;

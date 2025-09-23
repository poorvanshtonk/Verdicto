-- Creating user sessions table for tracking active sessions
-- Create user_sessions table to track active user sessions (optional)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions table
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON user_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

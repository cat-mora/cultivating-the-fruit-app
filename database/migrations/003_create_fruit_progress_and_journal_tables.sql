-- Migration: Create Fruit Progress and Journal Tables
-- Description: Creates tables for tracking daily fruit-of-the-spirit progress and encrypted journal entries
-- Version: 003
-- Created: 2026-03-30

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: fruit_progress
-- Purpose: Tracks completion of daily fruit-of-the-spirit themed activities
-- RLS: Users can only see/manage their own fruit progress
CREATE TABLE IF NOT EXISTS fruit_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fruit_type VARCHAR(20) NOT NULL CHECK (fruit_type IN ('love', 'joy', 'peace', 'patience', 'kindness', 'goodness', 'faithfulness', 'gentleness', 'self-control')),
  entry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  day_number INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: journal_entries
-- Purpose: Stores encrypted journal entries with client-side encryption
-- RLS: Users can only see/manage their own journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  encrypted_content TEXT NOT NULL,
  initialization_vector TEXT NOT NULL,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance

-- fruit_progress indexes
CREATE INDEX IF NOT EXISTS idx_fruit_progress_user_id ON fruit_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_fruit_progress_fruit_type ON fruit_progress(fruit_type);
CREATE INDEX IF NOT EXISTS idx_fruit_progress_entry_date ON fruit_progress(entry_date);
CREATE INDEX IF NOT EXISTS idx_fruit_progress_day_number ON fruit_progress(day_number);
CREATE INDEX IF NOT EXISTS idx_fruit_progress_completed ON fruit_progress(completed);

-- journal_entries indexes
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_date ON journal_entries(entry_date);

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE fruit_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Fruit Progress RLS Policies
CREATE POLICY "Users can view their own fruit progress" ON fruit_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fruit progress" ON fruit_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fruit progress" ON fruit_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fruit progress" ON fruit_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Journal Entries RLS Policies
CREATE POLICY "Users can view their own journal entries" ON journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries" ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" ON journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" ON journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Add triggers to update updated_at timestamps

-- fruit_progress trigger
CREATE OR REPLACE FUNCTION update_fruit_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fruit_progress_updated_at_trigger
  BEFORE UPDATE ON fruit_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_fruit_progress_timestamp();

-- journal_entries trigger
CREATE OR REPLACE FUNCTION update_journal_entries_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER journal_entries_updated_at_trigger
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_journal_entries_timestamp();

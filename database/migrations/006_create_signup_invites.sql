-- Migration: Create Signup Invites System
-- Description: Creates signup invite codes table and adds admin flag to profiles
-- Version: 006
-- Created: 2026-04-30

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add is_admin column to profiles table
ALTER TABLE IF EXISTS profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Create index for admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;

-- Table: signup_invites
-- Purpose: Stores invite codes required for new user signups
-- RLS: Only admin users can create and view codes
CREATE TABLE IF NOT EXISTS signup_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(8) NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT valid_code_format CHECK (code ~ '^[A-Z0-9]{8}$')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_signup_invites_code ON signup_invites(code);
CREATE INDEX IF NOT EXISTS idx_signup_invites_created_by ON signup_invites(created_by);
CREATE INDEX IF NOT EXISTS idx_signup_invites_is_used ON signup_invites(is_used);
CREATE INDEX IF NOT EXISTS idx_signup_invites_expires_at ON signup_invites(expires_at);

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE signup_invites ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin users can view all invite codes
CREATE POLICY "Admins can view all invite codes" ON signup_invites
  FOR SELECT USING (is_admin(auth.uid()));

-- Admin users can create invite codes
CREATE POLICY "Admins can create invite codes" ON signup_invites
  FOR INSERT WITH CHECK (is_admin(auth.uid()) AND auth.uid() = created_by);

-- Admin users can update invite codes
CREATE POLICY "Admins can update invite codes" ON signup_invites
  FOR UPDATE USING (is_admin(auth.uid()));

-- Admin users can delete invite codes
CREATE POLICY "Admins can delete invite codes" ON signup_invites
  FOR DELETE USING (is_admin(auth.uid()));

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_signup_invites_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER signup_invites_updated_at_trigger
  BEFORE UPDATE ON signup_invites
  FOR EACH ROW
  EXECUTE FUNCTION update_signup_invites_timestamp();

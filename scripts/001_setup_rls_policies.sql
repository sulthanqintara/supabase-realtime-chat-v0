-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow users to read all messages
CREATE POLICY "Allow users to read all messages" ON messages FOR SELECT USING (true);

-- Allow users to insert their own messages
CREATE POLICY "Allow users to insert their own messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles (for display names)
CREATE POLICY "Allow users to read all profiles" ON profiles FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Allow users to insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Migration to set guialowcarb@gmail.com as admin with password Luga94@@
-- Invalidates previous exposed credentials and ensures idempotent admin setup

DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- 1. Check if user guialowcarb@gmail.com exists in auth.users
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'guialowcarb@gmail.com' LIMIT 1;

  IF target_user_id IS NOT NULL THEN
    -- Update existing user credentials and confirmation status
    UPDATE auth.users
    SET
      encrypted_password = crypt('Luga94@@', gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      updated_at = NOW(),
      raw_app_meta_data = '{"provider": "email", "providers": ["email"]}',
      raw_user_meta_data = jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{name}', '"Adriana Araújo"'),
      confirmation_token = COALESCE(confirmation_token, ''),
      recovery_token = COALESCE(recovery_token, ''),
      email_change_token_new = COALESCE(email_change_token_new, ''),
      email_change = COALESCE(email_change, ''),
      email_change_token_current = COALESCE(email_change_token_current, ''),
      phone_change = COALESCE(phone_change, ''),
      phone_change_token = COALESCE(phone_change_token, ''),
      reauthentication_token = COALESCE(reauthentication_token, '')
    WHERE id = target_user_id;
  ELSE
    -- Create the admin user
    target_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role,
      aud,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      email_change_token_current,
      phone,
      phone_change,
      phone_change_token,
      reauthentication_token
    ) VALUES (
      target_user_id,
      '00000000-0000-0000-0000-000000000000',
      'guialowcarb@gmail.com',
      crypt('Luga94@@', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Adriana Araújo"}',
      false,
      'authenticated',
      'authenticated',
      '',
      '',
      '',
      '',
      '',
      NULL,
      '',
      '',
      ''
    );
  END IF;

  -- 2. Upsert into public.user_profiles
  INSERT INTO public.user_profiles (id, full_name, email, is_admin, role, created_at, updated_at)
  VALUES (target_user_id, 'Adriana Araújo', 'guialowcarb@gmail.com', true, 'admin', NOW(), NOW())
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.user_profiles.full_name, EXCLUDED.full_name),
    is_admin = true,
    role = 'admin',
    updated_at = NOW();

END $$;

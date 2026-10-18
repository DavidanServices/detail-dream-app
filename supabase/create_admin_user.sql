-- Run in Supabase > SQL Editor. Pick A or B, replace the email and password first.
-- Never commit a real password: keep the placeholders in this file.

-- A) Creates the admin login. Replace the two values, then Run.
do $$
declare
  v_email text := 'EMAILUL_TAU@exemplu.com';
  v_password text := 'PAROLA_TA_DE_CEL_PUTIN_12_CARACTERE';
  v_id uuid := gen_random_uuid();
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change
  ) values (
    '00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', lower(v_email),
    extensions.crypt(v_password, extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''
  );

  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (
    gen_random_uuid(), v_id, v_id::text,
    jsonb_build_object('sub', v_id::text, 'email', lower(v_email), 'email_verified', true),
    'email', now(), now(), now()
  );

  insert into public.admin_users (user_id) values (v_id);
end $$;

-- B) The user already exists (created in the dashboard): make them admin and set a new password.
update auth.users
set encrypted_password = extensions.crypt('PAROLA_TA_DE_CEL_PUTIN_12_CARACTERE', extensions.gen_salt('bf')),
    updated_at = now()
where email = lower('EMAILUL_TAU@exemplu.com');

insert into public.admin_users (user_id)
select id from auth.users where email = lower('EMAILUL_TAU@exemplu.com')
on conflict do nothing;

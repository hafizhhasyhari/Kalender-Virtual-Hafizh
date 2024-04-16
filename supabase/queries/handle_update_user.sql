create or replace function public.handle_update_user() 
returns trigger 
language plpgsql 
security definer set search_path = public
as $$
begin
  update public.profiles
  set email = new.email, last_sign_in_at = new.last_sign_in_at
  where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_updated
after update of email, last_sign_in_at on auth.users
  for each row execute procedure public.handle_update_user();
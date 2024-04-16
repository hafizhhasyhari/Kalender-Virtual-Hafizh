create or replace function delete_storage_object(bucket text, object text, out status int, out content varchar)
returns record
language 'plpgsql'
security definer
as $$
declare
  project_url varchar := '<YOURPROJECTURL>';
  service_role_key varchar := '<YOURSERVICEROLEKEY>'; --  full access needed
  url varchar := project_url||'/storage/v1/object/'||bucket||'/'||object;
begin
  select
      into status, content
           result.status::int, result.content::varchar
      FROM extensions.http((
    'DELETE',
    url,
    ARRAY[extensions.http_header('authorization','Bearer '||service_role_key)],
    NULL,
    NULL)::extensions.http_request) as result;
end;
$$;

create or replace function delete_avatar(avatar_url text, out status int, out content varchar)
returns record
language 'plpgsql'
security definer
as $$
begin
  select
      into status, content
           result.status, result.content
      from public.delete_storage_object('avatars', avatar_url) as result;
end;
$$;

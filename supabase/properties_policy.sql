CREATE POLICY "properties_policy"
ON public.properties
FOR SELECT USING (
auth.email() = email
) WITH CHECK (
  auth.email() = email
)
FOR UPDATE USING (
  auth.email() = email
) WITH CHECK (
  auth.email() = email
)
FOR DELETE USING (
  auth.uid() = user_id
);
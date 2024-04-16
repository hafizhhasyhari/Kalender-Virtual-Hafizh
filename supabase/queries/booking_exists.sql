CREATE OR REPLACE FUNCTION booking_exists(sdate DATE, edate DATE, propid UUID, statusid UUID)
  RETURNS TABLE (property_id UUID, start_date DATE, end_date DATE)
  LANGUAGE plpgsql AS
$func$
#variable_conflict use_column
BEGIN
   RETURN QUERY
   SELECT property_id, start_date, end_date FROM bookings INNER JOIN fact_table ON bookings.fact_table_id = fact_table.id WHERE (start_date, end_date) OVERLAPS (sdate - 1, edate + 1) AND fact_table.property_id=propid AND bookings.status_id=statusid;
END
$func$;
import { pool } from "../models/db";

export const getBookingById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);
  return result.rows[0];
};

export const createBooking = async (customer_id: number, vehicle_id: number, start_date: string, end_date: string, total_price: number) => {
  const result = await pool.query(
    `INSERT INTO bookings (customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status)
     VALUES ($1,$2,$3,$4,$5,'active') RETURNING *`,
    [customer_id, vehicle_id, start_date, end_date, total_price]
  );
  return result.rows[0];
};

export const updateBookingStatus = async (id: number, status: string) => {
  const result = await pool.query(
    `UPDATE bookings SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

export const markVehicleAvailability = async (vehicle_id: number, status: string) => {
  await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2`, [status, vehicle_id]);
};

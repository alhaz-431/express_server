import { pool } from "../models/db";

export const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result.rows;
};

export const getVehicleById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
  return result.rows[0];
};

export const createVehicle = async (vehicle: any) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = vehicle;
  const result = await pool.query(
    `INSERT INTO vehicles (vehicle_name,type,registration_number,daily_rent_price,availability_status)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );
  return result.rows[0];
};

export const updateVehicle = async (id: number, vehicle: any) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = vehicle;
  const result = await pool.query(
    `UPDATE vehicles 
     SET vehicle_name=COALESCE($1,vehicle_name),
         type=COALESCE($2,type),
         registration_number=COALESCE($3,registration_number),
         daily_rent_price=COALESCE($4,daily_rent_price),
         availability_status=COALESCE($5,availability_status),
         updated_at=NOW()
     WHERE id=$6 RETURNING *`,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
  );
  return result.rows[0];
};

export const deleteVehicle = async (id: number) => {
  await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);
};

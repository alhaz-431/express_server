import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = 5000;

// parser
app.use(express.json());

// DB
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      age INT,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT false,
      due_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

initDB();

// logger midleware

const logger=(req:Request, res:Response,next:NextFunction)=>{
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
  next();
};



// root
app.get("/",logger, (req: Request, res: Response) => {
  res.send("Hellow Next Level er developer !");
});

// users create
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email]
    );

    return res.status(201).json({
      success: true,
      message: "Data inserted successfully",
      data: result.rows[0],
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// users read (GET all)
// api aivabe banay
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.rows,
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// users/

app.get("/users/:id", async(req:Request, res:Response)=>{

// console.log(req.params.id);
// res.send({message:"API is cool..."})
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id =$1`,[req.params.id]);


    if(result.rows.length ===0){

      res.status(404).json({
        succes:false,
        message:"Users not found",
      })
    }else{
      res.status(200).json({
        succes:true,
        message:"Users fetched succesfully",
        data:result.rows[0]
      })
    }
     
  } catch (err:any) {

   res.status(500).json({
      succes: false,
      message: err.message,
   }) 
  }


})


// update api

app.put("/users/:id", async(req:Request, res:Response)=>{

// console.log(req.params.id);
const {name, email}=req.body;

// res.send({message:"API is cool..."})
  try {
    const result = await pool.query(`UPDATE users SET name =$1, email=$2 WHERE id=$3 RETURNING *`, [name, email, req.params.id]);

    if(result.rows.length ===0){

      res.status(404).json({
        succes:false,
        message:"Users not found",
      })
    }else{
      res.status(200).json({
        succes:true,
        message:"Users updated succesfully",
        data:result.rows[0]
      })
    }
     
  } catch (err:any) {

   res.status(500).json({
      succes: false,
      message: err.message,
   }) 
  }


});






app.delete("/users/:id", async(req:Request, res:Response)=>{

// console.log(req.params.id);
// res.send({message:"API is cool..."})
  try {
    const result = await pool.query(`DELETE FROM users WHERE id =$1`,[req.params.id]);

   


    if(result.rowCount ===0){

      res.status(404).json({
        succes:false,
        message:"Users not found",
      })
    }else{
      res.status(200).json({
        succes:true,
        message:"Users deleted succesfully",
        data:result.rows,
      })
    }
     


  } catch (err:any) {

   res.status(500).json({
      succes: false,
      message: err.message,
   }) 
  }
});

// todos crud

app.post("/todos", async(req:Request, res:Response)=>{

  const {user_id,title}= req.body;

try {

  const result = await pool.query(`INSERT INTO todos(user_id,title) VALUES($1, $2) RETURNING *`,[user_id,title])
  res.status(201).json({
    succes:true,
    message:"Todo created",
    data:result.rows[0]
  })
  
} catch (err:any) {

res.status(500).json({
  succes:false,
  message:err.message,
})
  
}

});



app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
    return res.status(200).json({
      success: true,
      message: "todos fetched successfully",
      data: result.rows,
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});



// not found route sobsomoy last rhakte hobe


app.use((req,res)=>{
  res.status(404).json({
    succes:false,
    message:"Route not found",
    path:req.path,
  });

});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});









//  ----------------------------------------------------
// |                 🖥️ React Frontend                 |
// |----------------------------------------------------|
// |  ✔ Form submit করে data পাঠায় backend-এ           |
// |  ✔ Backend থেকে response নিয়ে UI-তে দেখায়          |
//  ----------------------------------------------------
//                       |
//                       | (JSON Data পাঠায়)
//                       v
//  ----------------------------------------------------
// |              🚀 Express.js Backend API             |
// |----------------------------------------------------|
// |  ✔ Request গ্রহণ করে                              |
// |  ✔ Validation করে                                 |
// |  ✔ Database-এ query চালায়                          |
// |  ✔ Result আবার React-এ পাঠায়                      |
//  ----------------------------------------------------
//                       |
//                       | (SQL Query পাঠায়)
//                       v
//  ----------------------------------------------------
// |                 🗄️ PostgreSQL Database             |
// |----------------------------------------------------|
// |  ✔ ডেটা সেভ করে (INSERT)                           |
// |  ✔ ডেটা দেখায় (SELECT)                             |
// |  ✔ ডেটা আপডেট করে (UPDATE)                        |
// |  ✔ ডেটা ডিলিট করে (DELETE)                        |
//  ----------------------------------------------------
//                       ^
//                       |
//                       | (Query result ফিরে আসে)
//  ----------------------------------------------------
// |              🚀 Express.js Backend API             |
// |----------------------------------------------------|
// |  ✔ Result format করে JSON বানায়                   |
// |  ✔ React-এ response পাঠায়                         |
//  ----------------------------------------------------
//                       ^
//                       |
//                       | (JSON Response)
//  ----------------------------------------------------
// |                 🖥️ React Frontend                 |
// |----------------------------------------------------|
// |  ✔ Response পায়                                   |
// |  ✔ UI update করে                                 |
// |  ✔ User কে দেখায়                                 |
//  ----------------------------------------------------

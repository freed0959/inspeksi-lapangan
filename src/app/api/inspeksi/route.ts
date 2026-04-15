import { NextRequest, NextResponse } from 'next/server';
import sql from 'mssql';

const config = {
  server: process.env.AZURE_SQL_SERVER || '',
  database: process.env.AZURE_SQL_DATABASE || '',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.AZURE_SQL_USER || '',
      password: process.env.AZURE_SQL_PASSWORD || '',
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
};

export async function POST(request: NextRequest) {
  const pool = new sql.ConnectionPool(config);
  
  try {
    const formData = await request.formData();
    const lokasi = formData.get('lokasi') as string;
    const tanggal = formData.get('tanggal') as string;
    const penginspeksi = formData.get('penginspeksi') as string;
    const kategori = formData.get('kategori') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const userEmail = formData.get('userEmail') as string;
    const userName  = formData.get('userName') as string;
    const files = formData.getAll('fotos') as File[];

    // Validate input
    if (!lokasi || !tanggal || !penginspeksi || !kategori) {
      return NextResponse.json(
        { error: 'Data tidak lengkap: lokasi, tanggal, penginspeksi, dan kategori harus diisi' },
        { status: 400 }
      );
    }

    console.log('🔌 Attempting to connect to Azure SQL...');
    console.log('Server:', process.env.AZURE_SQL_SERVER);
    console.log('Database:', process.env.AZURE_SQL_DATABASE);
    console.log('Files received:', files.length);
    console.log('User:', userEmail);

    await pool.connect();
    console.log('✅ Connected to Azure SQL successfully!');

    // Insert inspeksi data dan get ID
    const insertResult = await pool
      .request()
      .input('lokasi', sql.VarChar, lokasi)
      .input('tanggal', sql.DateTime, new Date(tanggal))
      .input('penginspeksi', sql.VarChar, penginspeksi)
      .input('kategori', sql.VarChar, kategori)
      .input('deskripsi', sql.VarChar, deskripsi || '')
      .input('userEmail', sql.VarChar, userEmail)
      .input('userName', sql.VarChar, userName)
      .input('createdAt', sql.DateTime, new Date())
      .query(`
        INSERT INTO inspeksi_lapangan 
        (lokasi, tanggal, penginspeksi, kategori, deskripsi, user_email, user_name, created_at)
        VALUES 
        (@lokasi, @tanggal, @penginspeksi, @kategori, @deskripsi, @userEmail, @userName, @createdAt);
        SELECT SCOPE_IDENTITY() as id;
      `);

    const inspeksiId = insertResult.recordset[0]?.id;
    console.log('✅ Inspeksi inserted with ID:', inspeksiId);

    // Insert fotos jika ada
    let fotosInserted = 0;
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer());
          
          await pool
            .request()
            .input('inspeksi_id', sql.Int, inspeksiId)
            .input('foto_data', sql.VarBinary, buffer)
            .input('foto_nama', sql.VarChar, file.name)
            .input('foto_tipe', sql.VarChar, file.type)
            .input('foto_ukuran', sql.Int, file.size)
            .query(`
              INSERT INTO inspeksi_fotos
              (inspeksi_id, foto_data, foto_nama, foto_tipe, foto_ukuran)
              VALUES
              (@inspeksi_id, @foto_data, @foto_nama, @foto_tipe, @foto_ukuran)
            `);
          
          fotosInserted++;
          console.log(`✅ Photo ${fotosInserted} inserted: ${file.name} (${file.size} bytes)`);
        }
      }
    }

    await pool.close();

    return NextResponse.json(
      { 
        message: 'Data inspeksi dan foto berhasil disimpan', 
        inspeksiId,
        fotosInserted,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error:', error);
    
    let errorMessage = 'Gagal menyimpan data ke database';
    
    if (error instanceof sql.ConnectionError) {
      errorMessage = `Koneksi Error: ${error.message}`;
      console.error('Connection details:', {
        server: process.env.AZURE_SQL_SERVER,
        database: process.env.AZURE_SQL_DATABASE,
        user: process.env.AZURE_SQL_USER,
      });
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    await pool.close().catch(() => {});
  }
}

// GET untuk fetch data dengan fotos
export async function GET(request: NextRequest) {
  const pool = new sql.ConnectionPool(config);
  
  try {
    await pool.connect();

    // Get foto count untuk setiap inspeksi
    const result = await pool.request().query(`
      SELECT 
        i.*,
        COUNT(f.id) as total_fotos
      FROM inspeksi_lapangan i
      LEFT JOIN inspeksi_fotos f ON i.id = f.inspeksi_id
      GROUP BY i.id, i.lokasi, i.tanggal, i.penginspeksi, i.kategori, i.deskripsi, i.created_at, i.updated_at
      ORDER BY i.created_at DESC
    `);

    await pool.close();

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data dari database' },
      { status: 500 }
    );
  } finally {
    await pool.close().catch(() => {});
  }
}


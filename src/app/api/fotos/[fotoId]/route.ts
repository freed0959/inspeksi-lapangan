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

export async function GET(
  request: NextRequest,
  { params }: { params: { fotoId: string } }
) {
  const pool = new sql.ConnectionPool(config);

  try {
    const fotoId = params.fotoId;

    await pool.connect();

    const result = await pool
      .request()
      .input('id', sql.Int, parseInt(fotoId))
      .query(`
        SELECT foto_data, foto_tipe, foto_nama
        FROM inspeksi_fotos
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Foto tidak ditemukan' },
        { status: 404 }
      );
    }

    const foto = result.recordset[0];
    const buffer = foto.foto_data as Buffer;

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': foto.foto_tipe || 'image/jpeg',
        'Content-Disposition': `inline; filename="${foto.foto_nama}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil foto' },
      { status: 500 }
    );
  } finally {
    await pool.close().catch(() => {});
  }
}

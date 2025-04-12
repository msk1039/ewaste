import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get list of all tables in the database
    const [tables] = await executeQuery(
      "SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = 'myapp' AND TABLE_TYPE = 'BASE TABLE'"
    );
    
    // Get data for each table
    const tableData = await Promise.all(
      (tables as any[]).map(async (table) => {
        // Extract the table name properly from the result
        const tableName = table.TABLE_NAME;
        
        if (!tableName) {
          console.log('Skipping undefined table name', table);
          return null;
        }
        
        // Get data for this table
        const [rows] = await executeQuery(`SELECT * FROM \`${tableName}\` LIMIT 100`);
        
        // Get columns for this table
        const [columns] = await executeQuery(
          `SELECT COLUMN_NAME, DATA_TYPE, COLUMN_KEY, IS_NULLABLE 
           FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = 'myapp' AND TABLE_NAME = ?`,
          [tableName]
        );
        
        return {
          tableName: tableName,
          columns,
          data: rows
        };
      })
    );
    
    return NextResponse.json({ tables: tableData });
  } catch (error) {
    console.error('Error fetching table data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database tables' },
      { status: 500 }
    );
  }
}

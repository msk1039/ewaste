"use client"

import { useEffect, useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Column {
  COLUMN_NAME: string
  DATA_TYPE: string
  COLUMN_KEY: string
  IS_NULLABLE: string
}

interface TableData {
  tableName: string
  columns: Column[]
  data: any[]
}

export default function DatabaseDataPage() {
  const [tables, setTables] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDatabaseData = async () => {
      try {
        const response = await fetch('/api/database/tables')
        if (!response.ok) {
          throw new Error('Failed to fetch database data')
        }
        const data = await response.json()
        setTables(data.tables)
        if (data.tables.length > 0) {
          setActiveTab(data.tables[0].tableName)
        }
      } catch (err) {
        console.error('Error fetching database tables:', err)
        setError('Failed to load database tables. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDatabaseData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <p className="text-lg">Loading database tables...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Database Tables</CardTitle>
          <CardDescription>
            View and explore data from all database tables
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tables.length > 0 ? (
            <div>
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Select a table:</h3>
                <select 
                  className="w-full p-2 border rounded-md" 
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                >
                  {tables.map((table) => (
                    <option key={table.tableName} value={table.tableName}>
                      {table.tableName}
                    </option>
                  ))}
                </select>
              </div>
              
            {tables.map((table) => (
              table.tableName === activeTab && (
                <div key={table.tableName} className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {table.columns.map((column) => (
                          <TableHead key={column.COLUMN_NAME}>
                            {column.COLUMN_NAME}
                            <span className="ml-1 text-xs text-gray-500">
                              ({column.DATA_TYPE})
                            </span>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {table.data.length > 0 ? (
                        table.data.map((row, index) => (
                          <TableRow key={index}>
                            {table.columns.map((column) => (
                              <TableCell key={column.COLUMN_NAME}>
                                {row[column.COLUMN_NAME] !== null 
                                  ? String(row[column.COLUMN_NAME]) 
                                  : 'NULL'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell 
                            colSpan={table.columns.length} 
                            className="text-center py-4">
                            No data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )
            ))}

            </div>
              ) : (
            <p className="text-center py-4">No database tables found</p>
           )}
        </CardContent>
      </Card>
    </div>
  )
}

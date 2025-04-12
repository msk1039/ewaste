"use client"

import { useEffect, useState, useRef } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Prism from 'prismjs'
import 'prismjs/components/prism-sql'
import 'prism-themes/themes/prism-vsc-dark-plus.css'

interface Procedure {
  name: string
  type: string
  definition: string
}

interface Trigger {
  name: string
  timing: string
  event: string
  table_name: string
  definition: string
}

export default function DatabaseProceduresPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [triggers, setTriggers] = useState<Trigger[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('procedures')
  const [error, setError] = useState<string | null>(null)
  const codeRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Highlight code after data is loaded
  useEffect(() => {
    if (!loading && procedures.length > 0) {
      // Wait for the DOM to update
      setTimeout(() => {
        Object.values(codeRefs.current).forEach(ref => {
          if (ref) Prism.highlightElement(ref)
        })
      }, 100)
    }
  }, [loading, procedures, triggers, activeTab])

  useEffect(() => {
    const fetchDatabaseProcedures = async () => {
      try {
        const response = await fetch('/api/database/procedures')
        if (!response.ok) {
          throw new Error('Failed to fetch database procedures')
        }
        const data = await response.json()
        setProcedures(data.procedures || [])
        setTriggers(data.triggers || [])
      } catch (err) {
        console.error('Error fetching database procedures:', err)
        setError('Failed to load database procedures. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDatabaseProcedures()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <p className="text-lg">Loading database procedures...</p>
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
          <CardTitle>Database Procedures & Triggers</CardTitle>
          <CardDescription>
            View all stored procedures, functions, and triggers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="procedures">Procedures & Functions</TabsTrigger>
              <TabsTrigger value="triggers">Triggers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="procedures">
              {procedures.length > 0 ? (
                <div className="space-y-6">
                  {procedures.map((proc, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-muted/50 py-3">
                        <CardTitle className="text-md font-semibold">
                          {proc.name} <span className="text-xs ml-2 opacity-70">({proc.type})</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="rounded-md overflow-hidden border-0">
                          <pre className="language-sql m-0 p-4">
                            <code 
                              className="language-sql"
                              ref={(el) => {codeRefs.current[`proc-${index}`] = el}}
                            >
                              {proc.definition || 'No definition available'}
                            </code>
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4">No procedures or functions found</p>
              )}
            </TabsContent>
            
            <TabsContent value="triggers">
              {triggers.length > 0 ? (
                <div className="space-y-6">
                  {triggers.map((trigger, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-muted/50 py-3">
                        <CardTitle className="text-md font-semibold">
                          {trigger.name} 
                          <span className="text-xs ml-2 opacity-70">
                            ({trigger.timing} {trigger.event} ON {trigger.table_name})
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="rounded-md overflow-hidden border-0">
                          <pre className="language-sql m-0 p-4">
                            <code 
                              className="language-sql"
                              ref={(el) => {codeRefs.current[`trigger-${index}`] = el}}
                            >
                              {trigger.definition || 'No definition available'}
                            </code>
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4">No triggers found</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AssetBIARegister() {
  const { data, isLoading } = useSWR(`/api/asset-bia/register`, fetcher)
  const rows = data?.data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Impact Analysis Register</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No entries found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Custodian</TableHead>
                <TableHead>Financial</TableHead>
                <TableHead>Operational</TableHead>
                <TableHead>Reputational</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>MTD</TableHead>
                <TableHead>RTO</TableHead>
                <TableHead>RPO</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{r.asset_name}</span>
                      <span className="text-xs text-muted-foreground">{r.asset_code} • {r.asset_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{r.department}</TableCell>
                  <TableCell>{r.owner}</TableCell>
                  <TableCell>{r.custodian}</TableCell>
                  <TableCell><Badge variant="outline">{r.impact_financial}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{r.impact_operational}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{r.impact_reputational}</Badge></TableCell>
                  <TableCell><Badge variant="outline">{r.impact_compliance}</Badge></TableCell>
                  <TableCell>{r.max_tolerable_downtime_hours ?? "-"}</TableCell>
                  <TableCell>{r.rto_hours ?? "-"}</TableCell>
                  <TableCell>{r.rpo_hours ?? "-"}</TableCell>
                  <TableCell>{new Date(r.updated_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}



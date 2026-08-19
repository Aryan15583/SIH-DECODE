"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { client } from "@/lib/api/client";
import { 
  Database, 
  Search, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  ArrowUpDown,
  TableProperties,
  Activity,
  HardDrive
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DbStatus {
  status: string;
  connection_status: string;
  database_type: string;
  database_name: string;
  connection_url: string;
  table_count: number;
  counts: Record<string, number>;
}

interface TableColumn {
  name: string;
  type: string;
  nullable?: boolean;
  primary_key: boolean;
}

interface TableDataResponse {
  table_name: string;
  total_records: number;
  page: number;
  limit: number;
  pages: number;
  columns: TableColumn[];
  records: Record<string, any>[];
}

export default function DatabaseViewerPage() {
  const router = useRouter();
  const { push } = useToast();
  
  // States
  const [authorized, setAuthorized] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [tablesList, setTablesList] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("incidents");
  const [tableData, setTableData] = useState<TableDataResponse | null>(null);
  
  // Table Query States
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Loading States
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);

  // Authenticate Client-Side and get JWT
  useEffect(() => {
    const authenticate = async () => {
      if (typeof window !== "undefined") {
        const auth = localStorage.getItem("aegis_auth");
        if (auth !== "true") {
          router.push("/login");
          return;
        }

        // Get or fetch JWT token for database admin APIs
        let token = localStorage.getItem("aegis_token");
        if (!token) {
          try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiBase.replace(/\/$/, "")}/api/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: "analyst@aegissoc.ai", password: "analyst123" })
            });
            if (response.ok) {
              const data = await response.json();
              if (data.access_token) {
                localStorage.setItem("aegis_token", data.access_token);
                setAuthorized(true);
              }
            } else {
              console.error("Silent JWT authentication failed");
              setAuthorized(true);
            }
          } catch (err) {
            console.error("Silent JWT authentication error:", err);
            setAuthorized(true);
          }
        } else {
          setAuthorized(true);
        }
      }
    };
    authenticate();
  }, [router]);

  // Fetch Database Connection Status
  const fetchDbStatus = async () => {
    setLoadingStatus(true);
    try {
      const statusRes = await client.get<DbStatus>("/api/admin/database/status");
      setDbStatus(statusRes);
      
      const tablesRes = await client.get<any[]>("/api/admin/database/tables");
      setTablesList(tablesRes);
    } catch (err: any) {
      console.error(err);
      push("Database Connection Error", err.message || "Failed to load database metadata.", "error");
    } finally {
      setLoadingStatus(false);
    }
  };

  // Fetch Table Data
  const fetchTableData = async () => {
    if (!selectedTable) return;
    setLoadingTable(true);
    try {
      let url = `/api/admin/database/tables/${selectedTable}?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (sortCol) {
        url += `&sort_by=${sortCol}&sort_order=${sortOrder}`;
      }
      const dataRes = await client.get<TableDataResponse>(url);
      setTableData(dataRes);
    } catch (err: any) {
      console.error(err);
      push("Query Error", err.message || "Failed to execute table query.", "error");
    } finally {
      setLoadingTable(false);
    }
  };

  // Run initial load
  useEffect(() => {
    if (authorized) {
      fetchDbStatus();
    }
  }, [authorized]);

  // Refresh Table data on parameter changes
  useEffect(() => {
    if (authorized && selectedTable) {
      fetchTableData();
    }
  }, [authorized, selectedTable, page, search, sortCol, sortOrder]);

  const handleTableChange = (name: string) => {
    setSelectedTable(name);
    setPage(1);
    setSearch("");
    setSortCol("");
    setSortOrder("desc");
  };

  const handleSort = (columnName: string) => {
    if (sortCol === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortCol(columnName);
      setSortOrder("desc");
    }
    setPage(1);
  };

  if (!authorized) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-text-2 animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-1 flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> Database Operations Console
          </h2>
          <p className="text-xs text-text-2 mt-0.5">Development administrative tool for PostgreSQL relational & MongoDB document store inspection</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            fetchDbStatus();
            fetchTableData();
          }}
          className="flex items-center gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", loadingStatus && "animate-spin")} /> Refresh Schema
        </Button>
      </div>

      {/* Grid Dashboard Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Status Card */}
        <Card className="p-4 flex items-center gap-4">
          <span className={cn(
            "h-11 w-11 shrink-0 rounded-xl flex items-center justify-center border",
            dbStatus?.status === "online" 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
              : "bg-danger/10 border-danger/20 text-danger"
          )}>
            <Activity className="h-5 w-5 animate-pulse" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-text-2 font-medium">Connection Status</p>
            <p className="text-base font-bold text-text-1 truncate mt-0.5">
              {loadingStatus ? "Querying..." : dbStatus?.status === "online" ? "Active" : "Offline"}
            </p>
            <p className="text-[10px] text-text-2 truncate">{dbStatus?.connection_status}</p>
          </div>
        </Card>

        {/* Engine Card */}
        <Card className="p-4 flex items-center gap-4">
          <span className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20 text-primary">
            <HardDrive className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-text-2 font-medium">Database Engine</p>
            <p className="text-base font-bold text-text-1 truncate mt-0.5">
              {loadingStatus ? "—" : (dbStatus?.database_type || "PostgreSQL + MongoDB")}
            </p>
            <p className="text-[10px] text-text-2 truncate">{dbStatus?.connection_url}</p>
          </div>
        </Card>

        {/* Tables Count Card */}
        <Card className="p-4 flex items-center gap-4">
          <span className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <TableProperties className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-text-2 font-medium">Platform Schema</p>
            <p className="text-base font-bold text-text-1 truncate mt-0.5">
              {loadingStatus ? "—" : `${dbStatus?.table_count || 8} System Tables`}
            </p>
            <p className="text-[10px] text-text-2 truncate">Database Name: {dbStatus?.database_name || "aegis_soc"}</p>
          </div>
        </Card>
      </div>

      {/* Main Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
        {/* Left Side: Tables Selection List */}
        <Card className="p-3">
          <div className="px-2 py-1.5 mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-text-2">Schema Tables</p>
          </div>
          <nav className="flex flex-col gap-1">
            {loadingStatus ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-9 w-full bg-white/5 rounded-lg animate-pulse" />
              ))
            ) : (
              tablesList.map((tbl) => (
                <button
                  key={tbl.table_name}
                  onClick={() => handleTableChange(tbl.table_name)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors flex items-center justify-between cursor-pointer",
                    selectedTable === tbl.table_name
                      ? "bg-primary/15 text-text-1 border border-primary/20"
                      : "text-text-2 hover:bg-white/5 hover:text-text-1 border border-transparent"
                  )}
                >
                  <span className="font-medium truncate">{tbl.table_name}</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-text-2 font-semibold">
                    {tbl.row_count}
                  </span>
                </button>
              ))
            )}
          </nav>
        </Card>

        {/* Right Side: Table Inspector & Data Grid */}
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-1 pb-4">
              <div>
                <h3 className="text-base font-bold text-text-1 capitalize flex items-center gap-1.5">
                  <TableProperties className="h-4.5 w-4.5 text-primary" /> {selectedTable} Records
                </h3>
                <p className="text-xs text-text-2 mt-0.5">
                  Displaying {tableData?.records.length || 0} of {tableData?.total_records || 0} rows found in table
                </p>
              </div>

              {/* Text Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-text-2" />
                <input
                  type="text"
                  placeholder="Search table values..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-border-1 bg-surface-1 pl-9 pr-3 py-2 text-xs text-text-1 outline-none focus:border-primary/50"
                />
              </div>
            </div>

            {/* Table Grid container */}
            <div className="overflow-x-auto w-full mt-4 border border-border-1 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-white/5 text-text-2 uppercase text-[10px] tracking-wider border-b border-border-1">
                  <tr>
                    {tableData?.columns.map((col) => (
                      <th 
                        key={col.name} 
                        onClick={() => handleSort(col.name)}
                        className="px-4 py-3 font-semibold select-none cursor-pointer hover:bg-white/5 hover:text-text-1"
                      >
                        <div className="flex items-center gap-1">
                          {col.name}
                          <ArrowUpDown className={cn(
                            "h-3 w-3 text-text-2",
                            sortCol === col.name && "text-primary"
                          )} />
                          {col.primary_key && (
                            <span className="text-[8px] bg-primary/20 text-primary border border-primary/30 px-1 rounded">PK</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-1 text-text-1 bg-surface-0/30">
                  {loadingTable ? (
                    <tr>
                      <td colSpan={tableData?.columns.length || 6} className="py-24 text-center text-text-2 animate-pulse">
                        Executing database query...
                      </td>
                    </tr>
                  ) : tableData?.records && tableData.records.length > 0 ? (
                    tableData.records.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        {tableData.columns.map((col) => {
                          const val = row[col.name];
                          let displayVal = "";
                          if (val === null || val === undefined) {
                            displayVal = "NULL";
                          } else if (typeof val === "object") {
                            displayVal = JSON.stringify(val);
                          } else {
                            displayVal = String(val);
                          }

                          return (
                            <td key={col.name} className="px-4 py-3 max-w-xs truncate font-mono text-[11px]">
                              <span className={cn(
                                val === null && "text-text-2 font-normal italic",
                                typeof val === "boolean" && "text-cyan-400 font-semibold"
                              )}>
                                {displayVal}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={tableData?.columns.length || 6} className="py-12 text-center text-text-2 italic">
                        No records match the query criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {tableData && tableData.pages > 1 && (
              <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-border-1 select-none">
                <p className="text-xs text-text-2">
                  Page {tableData.page} of {tableData.pages}
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || loadingTable}
                    onClick={() => setPage(p => p - 1)}
                    className="p-1 px-2.5 flex items-center gap-1 text-xs"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= tableData.pages || loadingTable}
                    onClick={() => setPage(p => p + 1)}
                    className="p-1 px-2.5 flex items-center gap-1 text-xs"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

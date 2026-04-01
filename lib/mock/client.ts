import {
  mockUGCs, mockContracts, mockOrders, mockVideos,
  mockCampaigns, mockNotifications, mockBriefs, mockSettings,
  getMockUGCWithRelations, getAllUGCsWithRelations,
} from './data'

// In-memory store (mutations persist for the session)
const store: Record<string, unknown[]> = {
  ugcs: [...mockUGCs],
  contracts: [...mockContracts],
  orders: [...mockOrders],
  videos: [...mockVideos],
  campaigns: [...mockCampaigns],
  notifications: [...mockNotifications],
  briefs: [...mockBriefs],
  settings: [...mockSettings],
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryResult = { data: any; error: { message: string } | null }

class MockQueryBuilder {
  private _table: string
  private _filters: { field: string; value: unknown }[]
  private _orderField: string | null
  private _orderAsc: boolean
  private _limitN: number | null
  private _selectStr: string
  private _insertData: Row | null
  private _updateData: Row | null
  private _mode: 'select' | 'insert' | 'update' | 'delete' | 'upsert'
  private _upsertData: Row | null
  private _upsertConflict: string | null

  constructor(table: string) {
    this._table = table
    this._filters = []
    this._orderField = null
    this._orderAsc = true
    this._limitN = null
    this._selectStr = '*'
    this._insertData = null
    this._updateData = null
    this._mode = 'select'
    this._upsertData = null
    this._upsertConflict = null
  }

  select(str = '*') {
    this._selectStr = str
    // Don't overwrite insert/update/delete mode — .insert().select().single() must still insert
    if (this._mode === 'select') {
      this._mode = 'select'
    }
    return this
  }

  eq(field: string, value: unknown) {
    this._filters.push({ field, value })
    return this
  }

  order(field: string, opts?: { ascending?: boolean }) {
    this._orderField = field
    this._orderAsc = opts?.ascending !== false
    return this
  }

  limit(n: number) {
    this._limitN = n
    return this
  }

  insert(data: Row) {
    this._insertData = data
    this._mode = 'insert'
    return this
  }

  update(data: Row) {
    this._updateData = data
    this._mode = 'update'
    return this
  }

  delete() {
    this._mode = 'delete'
    return this
  }

  upsert(data: Row, opts?: { onConflict?: string }) {
    this._upsertData = data
    this._upsertConflict = opts?.onConflict || null
    this._mode = 'upsert'
    return this
  }

  single(): QueryResult {
    const result = this._execute()
    if (!result.data) return { data: null, error: { message: 'Row not found' } }
    const rows = Array.isArray(result.data) ? result.data : [result.data]
    if (rows.length === 0) return { data: null, error: { message: 'Row not found' } }
    return { data: rows[0], error: null }
  }

  // thenable so `await supabase.from(...).select()` works
  then(resolve: (val: QueryResult) => void, reject?: (err: unknown) => void) {
    try {
      const result = this._execute()
      resolve(result)
    } catch (err) {
      reject?.(err)
    }
    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(_reject: (err: unknown) => void) {
    return this
  }

  private _getRows(): Row[] {
    // For selects with relation joins, use pre-joined helpers
    const hasJoin = this._selectStr.includes('(*)')
    if (hasJoin && this._table === 'ugcs') {
      // Check if filtering by id
      const idFilter = this._filters.find(f => f.field === 'id')
      if (idFilter) {
        const row = getMockUGCWithRelations(idFilter.value as string)
        return row ? [row] : []
      }
      return getAllUGCsWithRelations() as Row[]
    }
    // For notifications with ugc join
    if (hasJoin && this._table === 'notifications') {
      const rows = (store[this._table] || []) as Row[]
      return rows.map(n => ({
        ...n,
        ugcs: mockUGCs.find(u => u.id === n.ugc_id) || null,
      }))
    }
    // For contracts with ugc join
    if (hasJoin && this._table === 'contracts') {
      const rows = (store[this._table] || []) as Row[]
      return rows.map(c => ({
        ...c,
        ugcs: mockUGCs.find(u => u.id === c.ugc_id) || null,
      }))
    }
    return (store[this._table] || []) as Row[]
  }

  private _applyFilters(rows: Row[]): Row[] {
    return rows.filter(row =>
      this._filters.every(f => row[f.field] === f.value)
    )
  }

  private _execute(): QueryResult {
    if (this._mode === 'insert') {
      const newRow: Row = {
        id: `${this._table.slice(0, 3)}-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...this._insertData,
      }
      store[this._table] = [...(store[this._table] || []), newRow]
      return { data: [newRow], error: null }
    }

    if (this._mode === 'update') {
      const rows = (store[this._table] || []) as Row[]
      const updated: Row[] = []
      store[this._table] = rows.map(row => {
        const match = this._filters.every(f => row[f.field] === f.value)
        if (match) {
          const newRow = { ...row, ...this._updateData }
          updated.push(newRow)
          return newRow
        }
        return row
      })
      return { data: updated, error: null }
    }

    if (this._mode === 'delete') {
      const rows = (store[this._table] || []) as Row[]
      store[this._table] = rows.filter(row =>
        !this._filters.every(f => row[f.field] === f.value)
      )
      return { data: [], error: null }
    }

    if (this._mode === 'upsert') {
      const conflictKey = this._upsertConflict || 'id'
      const rows = (store[this._table] || []) as Row[]
      const conflictVal = this._upsertData?.[conflictKey]
      const existing = rows.find(r => r[conflictKey] === conflictVal)
      if (existing) {
        store[this._table] = rows.map(r =>
          r[conflictKey] === conflictVal ? { ...r, ...this._upsertData } : r
        )
      } else {
        store[this._table] = [...rows, { id: `${this._table.slice(0, 3)}-${Date.now()}`, created_at: new Date().toISOString(), ...this._upsertData }]
      }
      return { data: [], error: null }
    }

    // SELECT
    let rows = this._getRows()
    rows = this._applyFilters(rows)

    if (this._orderField) {
      const field = this._orderField
      const asc = this._orderAsc
      rows = [...rows].sort((a, b) => {
        const av = a[field] as string
        const bv = b[field] as string
        return asc ? av?.localeCompare(bv) : bv?.localeCompare(av)
      })
    }

    if (this._limitN !== null) {
      rows = rows.slice(0, this._limitN)
    }

    return { data: rows, error: null }
  }
}

// Mock auth
const mockAuth = {
  getUser: async () => ({
    data: {
      user: {
        id: 'admin-mock',
        email: 'admin@grupom sm.co',
        role: 'authenticated',
      },
    },
    error: null,
  }),
  signInWithPassword: async () => ({
    data: { user: { id: 'admin-mock', email: 'admin@grupom sm.co' } },
    error: null,
  }),
  signOut: async () => ({ error: null }),
}

export function createMockClient() {
  return {
    from: (table: string) => new MockQueryBuilder(table),
    auth: mockAuth,
  }
}

import Button from './components/Button'
import Card from './components/Card'
import { rp } from './lib/format'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-3">
      <Card>
        <p className="text-sm text-gray-500">Saldo Kas</p>
        <p className="text-2xl font-bold">{rp(4850000)}</p>
      </Card>
      <Button>Bayar Iuran</Button>
      <Button variant="secondary">Lihat Laporan</Button>
    </div>
  )
}
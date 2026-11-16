import Card from '../components/Card'
import Button from '../components/Button'
import { rp } from '../lib/format'

export default function Beranda() {
    return (
        <div className="space-y-4">
            <div className="rounded-2xl p-5 bg-emerald-700 text-white">
                <p className="text-sm opacity-80">Saldo Kas Tarunesha</p>
                <p className="text-3xl font-bold">{rp(4850000)}</p>
            </div>
            <Card>
                <p className="text-xs text-gray-500">Tagihan jatuh tempo</p>
                <p className="font-semibold">Pertemuan 15 Nov</p>
                <p className="text-amber-500 font-bold mb-3">{rp(10000)}</p>
                <Button>Bayar</Button>
            </Card>
        </div>
    )
}
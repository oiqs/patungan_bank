export const rp = (n) =>
  'Rp\u00A0' + Number(n).toLocaleString('id-ID')

export const shortRp = (n) => {
  if (n >= 1_000_000) return 'Rp\u00A0' + (n / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + '\u00A0jt'
  if (n >= 1_000)     return 'Rp\u00A0' + (n / 1_000).toFixed(0) + '\u00A0rb'
  return rp(n)
}

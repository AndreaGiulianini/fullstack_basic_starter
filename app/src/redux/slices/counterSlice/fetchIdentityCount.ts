type IdentityCountResponse = { amount: number }

export const fetchIdentityCount = async (amount = 1): Promise<IdentityCountResponse> => {
  const response = await fetch('/api/identity-count', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch identity count: ${response.status} ${response.statusText}`)
  }
  const result = (await response.json()) as IdentityCountResponse
  if (typeof result?.amount !== 'number') {
    throw new Error('Identity count response missing numeric "amount"')
  }
  return result
}

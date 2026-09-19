const API_BASE_URL = 'http://127.0.0.1:8000'

export async function generateReport(reportData) {
  const response = await fetch(
    `${API_BASE_URL}/report/generate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/pdf',
      },
      body: JSON.stringify(reportData),
    }
  )

  if (!response.ok) {
    let message = 'Failed to generate report.'

    try {
      const errorData = await response.json()

      if (errorData.detail) {
        message = errorData.detail
      }
    } catch {
      // Backend response was not JSON.
    }

    throw new Error(message)
  }

  return response.blob()
}
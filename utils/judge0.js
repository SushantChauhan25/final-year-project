const axios = require('axios')

const runJudge0 = async ({ source_code, language_id, stdin }) => {
  const judgeUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
  const tokenUrl = `${judgeUrl}/submissions?base64_encoded=true&wait=true`

  const payload = {
    source_code: Buffer.from(source_code).toString('base64'),
    language_id,
    stdin: Buffer.from(stdin || '').toString('base64'),
  }

  const headers = {
    'Content-Type': 'application/json',
  }

  if (process.env.JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY
    headers['X-RapidAPI-Host'] = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com'
  }

  const response = await axios.post(tokenUrl, payload, { headers })
  const result = response.data

  return {
    stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf8') : '',
    stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf8') : '',
    compile_output: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString('utf8') : '',
    status: result.status ? result.status.description : 'Unknown',
  }
}

module.exports = runJudge0

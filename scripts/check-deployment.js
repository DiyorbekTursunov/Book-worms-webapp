const https = require("https")

const checkHealth = (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(`${url}/api/health`, (res) => {
        let data = ""

        res.on("data", (chunk) => {
          data += chunk
        })

        res.on("end", () => {
          try {
            const result = JSON.parse(data)
            resolve(result)
          } catch (error) {
            reject(error)
          }
        })
      })
      .on("error", (error) => {
        reject(error)
      })
  })
}

// Usage: node scripts/check-deployment.js https://your-app.vercel.app
const url = process.argv[2]
if (!url) {
  console.error("Please provide a URL: node scripts/check-deployment.js https://your-app.vercel.app")
  process.exit(1)
}

checkHealth(url)
  .then((result) => {
    console.log("✅ Deployment health check passed:")
    console.log(JSON.stringify(result, null, 2))
  })
  .catch((error) => {
    console.error("❌ Deployment health check failed:")
    console.error(error.message)
    process.exit(1)
  })

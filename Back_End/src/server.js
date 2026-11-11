const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const app = require('../src/app')
const { default: chalk } = require('chalk')

const PORT = process.env.PORT || 8001

app.listen(PORT, () => {
  console.log(chalk.bgGreen('Server is Running On PORT: ' + PORT))
})
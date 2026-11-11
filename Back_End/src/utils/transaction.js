

const carpetDB = require('../configDb')

const transaction = async (callback) => {
    const client = await carpetDB.connect()
    let transactionStarted = false

    try {
        await client.query('BEGIN')
        transactionStarted = true

        const result = await callback(client)

        await client.query('COMMIT')
        transactionStarted = false

        return result
    } catch (error) {
        if (transactionStarted) {
            await client.query('ROLLBACK').catch(() => {})
        }

        throw error
    } finally {
        client.release()
    }
}

module.exports = transaction
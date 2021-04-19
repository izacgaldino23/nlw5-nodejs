import express from 'express'

const app = express()

app.get('/', (req, res) => {
    return res.send("Olá mundo")
})

app.post('/', (req, res) => {
    return res.json({
        mensagem: "Sucesso",
    })
})

app.listen(3333, () => console.log('Server is running on port 3333'))

// missaoespacial
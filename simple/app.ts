import {Request, Response} from 'express';
import {gql, GraphQLClient} from 'graphql-request'

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

const query = gql`
    query MyQuery {
        getDemos {
            id
        }
    }
`

const client = new GraphQLClient(process.env.GRAPHQL_URL || '', {
    headers: {
        'x-api-key': process.env.API_KEY || '',
    }
})

app.get('/endpoint', (req: Request, res: Response) => {
    try {
        client.request(query, {}).then((data) => res.json(data))
    } catch (e) {
        res.json({
            message: e
        })
    }
})

app.listen(port, () => {
    console.log(`apiKey: ${process.env.API_KEY}`)
    console.log(`GraphQL Endpoint: ${process.env.GRAPHQL_URL}`)
    console.log(`Example app listening at http://localhost:${port}`)
})

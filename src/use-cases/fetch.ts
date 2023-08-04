import Koa from 'koa'
import json from "koa-json";
import cors from "@koa/cors";
import Router from "koa-router";
import Fetch from "../domain/services/Fetch";
import axios, {Axios} from "axios";

const fetchService = new Fetch(axios.create())

const app = new Koa()

app.use(cors())
app.use(json())

const router = new Router()

router.get(
    '/:id',
    async ctx => {
        const eventId = Number(ctx.params.id)
        if (isNaN(eventId)) ctx.throw(400, 'Invalid event id')

        try {
            ctx.body = await fetchService.getTickets(eventId)
            ctx.status = 200
        } catch (e) {
            console.log("Woops", e)
            ctx.throw(500)
        }
    }
)

app.use(router.routes())
app.listen(3000, () => console.log('Server is running on port 3000'))

export default app
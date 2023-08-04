import Ticket from "../entities/Ticket";
import {Axios} from "axios";
import {Price, Seat} from "../../types/fetch";

export default class Fetch {

    readonly axios: Axios

    constructor(axios: Axios) {
        this.axios = axios
    }

    public async getTickets(eventId: number): Promise<Ticket[]> {
        let seats = await this.fetch<Seat[]>(eventId, `Seats?constituentId=0&`)
        const prices = await this.fetch<Price[]>(eventId, `Prices?`)

        const tickets: Ticket[] = []

        seats = seats.filter(seat => seat.SeatStatusId === 0)
        seats.forEach(seat => {
            const price = prices.find(price => price.ZoneId === seat.ZoneId)
            if (price) tickets.push({
                seat: seat.SeatNumber,
                row: seat.SeatRow,
                section: seat.SectionId,
                price: price.Price
            })
        })

        return tickets
    }

    private async fetch<T>(eventId: number, urlParams: string): Promise<T> {
        const res = await this.axios.get<T>(`https://my.laphil.com/en/rest-proxy/TXN/Packages/${eventId}/${urlParams}modeOfSaleId=26`)
        if (res.status !== 200) throw new Error(res.statusText)
        return res.data
    }
}
import {beforeAll, describe, expect, test} from "@jest/globals";
import {Response} from "supertest";
import axios from "axios";
import {Price, Seat} from "../types/fetch";
import Fetch from "../domain/services/Fetch";
import MockAdapter from "axios-mock-adapter";
import {MOCK_EVENT_ID} from "../data";

describe("are seats returned", () => {
    let res: Response
    const ax = axios.create()
    let mockedAxios: MockAdapter

    beforeAll(() => {
        mockedAxios = new MockAdapter(ax)
    })

    afterEach(() => mockedAxios.reset());

    test("input-output check", async () => {
        const seats: Seat[] = [
            {SeatRow: "A", SeatNumber: 1, ZoneId: 1, SectionId: 2, SeatStatusId: 0},
            {SeatRow: "B", SeatNumber: 1, ZoneId: 1, SectionId: 2, SeatStatusId: 8},
            {SeatRow: "C", SeatNumber: 1, ZoneId: 1, SectionId: 2, SeatStatusId: 0},
        ]
        const prices: Price[] = [
            {ZoneId: 1, Price: 100},
            {ZoneId: 2, Price: 200},
        ]

        const url = `^https:\/\/my\.laphil\.com\/en\/rest-proxy\/TXN\/Packages\/${MOCK_EVENT_ID}/`
        mockedAxios.onGet(new RegExp(url + `Seats.*`)).reply(200, seats)
        mockedAxios.onGet(new RegExp(url + `Prices.*`)).reply(200, prices)

        const fetchService = new Fetch(ax)
        const result = await fetchService.getTickets(MOCK_EVENT_ID)

        expect(result).toStrictEqual([
            { seat: 1, row: "A", section: 2, price: 100 },
            { seat: 1, row: "C", section: 2, price: 100 },
        ])
    })
})
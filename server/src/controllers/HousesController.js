import { Auth0Provider } from "@bcwdev/auth0provider";
import { housesService } from "../services/HousesService.js";
import BaseController from "../utils/BaseController.js";

export class HousesController extends BaseController {
    constructor() {
        super('api/houses')
        this.router
            .get('', this.getHouses)
            .get('/:houseId', this.getHouseById)

            .use(Auth0Provider.getAuthorizedUserInfo)

            .post('', this.createHouse)
            .put('/:houseId', this.updateHouse)
            .delete('/:houseId', this.destroyHouse)
    }

    async getHouses(req, res, next) {
        try {
            const houses = await housesService.getHouses()
            res.send(houses)
        } catch (error) {
            next(error)
        }
    }

    async getHouseById(req, res, next) {
        try {
            const houseId = req.params.houseId
            const house = await housesService.getHouseById(houseId)
            res.send(house)
        } catch (error) {
            next(error)
        }
    }
    async createHouse(req, res, next) {
        try {
            const houseData = req.body
            const creatorId = req.user.id
            houseData.creatorId = creatorId
            const house = await housesService.createHouse(houseData)
            res.send(house)
        } catch (error) {
            next(error)
        }
    }
    async updateHouse(req, res, next) {
        try {
            const houseId = req.params.houseId
            const creatorId = req.user.id
            const houseData = req.body
            const house = await housesService.updateHouse(houseId, creatorId, houseData)
            res.send(house)
        } catch (error) {
            next(error)
        }
    }
    async destroyHouse(req, res, next) {
        try {
            const houseId = req.params.houseId
            const userId = req.user.id
            await housesService.destroyHouse(houseId, userId)
            res.send('House Destroyed!')
        } catch (error) {
            next(error)
        }
    }
}
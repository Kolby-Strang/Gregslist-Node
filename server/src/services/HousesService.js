import { dbContext } from "../db/DbContext.js"
import { BadRequest, UnAuthorized } from "../utils/Errors.js"

class HousesService {

    async getHouses() {
        const houses = await dbContext.Houses.find()
        return houses
    }
    async getHouseById(houseId) {
        const house = await dbContext.Houses.findById(houseId)
        if (!house) {
            throw new BadRequest(`${houseId} Is An Invalid Id`)
        }
        return house
    }
    async createHouse(houseData) {
        const house = await dbContext.Houses.create(houseData)
        return house
    }
    async updateHouse(houseId, creatorId, houseData) {
        const foundHouse = await dbContext.Houses.findById(houseId)
        if (!foundHouse) {
            throw new BadRequest(`${houseId} Is An Invalid Id`)
        }
        if (foundHouse.creatorId.toString() != creatorId) {
            throw new UnAuthorized('You Do Not Have Permission To Edit This House')
        }
        foundHouse.bedrooms = houseData.bedrooms != undefined ? houseData.bedrooms : foundHouse.bedrooms
        foundHouse.bathrooms = houseData.bathrooms != undefined ? houseData.bathrooms : foundHouse.bathrooms
        foundHouse.price = houseData.price != undefined ? houseData.price : foundHouse.price
        foundHouse.description = houseData.description || foundHouse.description
        foundHouse.year = houseData.year != undefined ? houseData.year : foundHouse.year
        foundHouse.imgUrl = houseData.imgUrl || foundHouse.imgUrl

        return foundHouse.save()
    }
    async destroyHouse(houseId, userId) {
        const foundHouse = await dbContext.Houses.findById(houseId)
        if (!foundHouse) {
            throw new BadRequest(`${houseId} Is An Invalid Id`)
        }
        if (foundHouse.creatorId.toString() != userId) {
            throw new UnAuthorized('You Do Not Have Permission To Delete This House')
        }
        await foundHouse.delete()
    }

}

export const housesService = new HousesService()
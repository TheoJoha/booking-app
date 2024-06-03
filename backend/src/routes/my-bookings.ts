import express, {Request, Response} from "express";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { HotelType } from "../shared/types";

const router = express.Router()

router.get("/", verifyToken, async(req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({
            bookings: {$elemMatch: {userId: req.userId}}
        })

        const results = hotels.map((hotel)=>{
            const userBookings = hotel.bookings.filter((booking)=> booking.userId === req.userId)

            const hotelWithUserBookings: HotelType = {
                ...hotel.toObject()
            }

            return hotelWithUserBookings
        
        })

        res.status(200).send(results)

        
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "Unable to fetch bookings"})
    }
})

export default router;
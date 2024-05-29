import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    facilities: number;
    imageFiles: FileList;
    adultCount: number;
    childCount: number;
}

const ManageHotelForm = () => {

    const formMethods = useForm<HotelFormData>()

    return (
        <FormProvider {...formMethods} >
            <form>
                <DetailsSection />
            </form>
        </FormProvider>
    )
}

export default ManageHotelForm
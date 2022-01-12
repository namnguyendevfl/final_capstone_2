import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";


export default function NewReservation({edit, reservations}) {
    const history = useHistory();
    const { reservation_id } = useParams();
    const initialReservation = {
        first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_date: "",
		reservation_time: "",
		people: "",
    }
    const [reservationData, setReservationData] = useState(initialReservation)

    // Working on validation
    const [errors, setErrors] = useState([]);

    if(edit) {
        // if either of these don't exist, we cannot continue.
        if(!reservations || !reservation_id) return null;
        const foundReservation = reservations.find((reservation) => 
            reservation.reservation_id === Number(reservation_id));
        if(!foundReservation || foundReservation.status !== "booked") {
            return <p>Only booked reservations can be edited.</p>;
        }
        setReservationData({
            first_name: foundReservation.first_name,
            last_name: foundReservation.last_name,
            mobile_number: foundReservation.mobile_number,
            reservation_date: foundReservation.reservation_date,
            reservation_time: foundReservation.reservation_time,
            people: foundReservation.people,
            reservation_id: foundReservation.reservation_id,
        });
    }


    const validateDate = (foundErrors) => {
        const reserveDate = new Date(`${reservationData.reservation_date}T${reservationData.reservation_time}:00.000`)
        console.log(reserveDate)
        const todaysDate = new Date()
        // the Date class has many functions, one of which returns the day (0 is sunday, 6 is saturday)
        if (reserveDate.getDay() === 2) {
            foundErrors.push({ message: "Reservations cannot be made on a Tuesday (Restaurant is closed)." });
        }
        if (reserveDate < todaysDate) {
            foundErrors.push({ message: "Reservations cannot be made in the past." });
        }

        if(reserveDate.getHours() < 10 || (reserveDate.getHours() === 10 && reserveDate.getMinutes() < 30)) {
            foundErrors.push({ message: "Reservation cannot be made: Restaurant is not open until 10:30AM." });
        } else if(reserveDate.getHours() > 22 || (reserveDate.getHours() === 22 && reserveDate.getMinutes() >= 30)) {
            foundErrors.push({ message: "Reservation cannot be made: Restaurant is closed after 10:30PM." });
        } else if(reserveDate.getHours() > 21 || (reserveDate.getHours() === 21 && reserveDate.getMinutes() > 30)) {
            foundErrors.push({ message: "Reservation cannot be made: Reservation must be made at least an hour before closing (10:30PM)." })
        }
        if(foundErrors.length > 0) {
            return false;
        }
        // if we get here, our reservation date is valid!
        return true;
    }
 
    const validateFields = (foundErrors) => {
        for(const field in reservationData) {
            if(reservationData[field] === "") {
                foundErrors.push({ message: `${field.split("_").join(" ")} cannot be left blank.`})
            }
        }

        if(reservationData.people <= 0) {
            foundErrors.push({ message: "Party must be a size of at least 1." })
        }

        if(foundErrors.length > 0) {
            return false;
        }
        return true;
    }




    const handleChange = ({target: {name,value}}) => {
        setReservationData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const foundErrors = []
        console.log(validateDate(foundErrors))
        console.log(validateFields(foundErrors))
        if(validateDate(foundErrors) && validateFields(foundErrors)) {
            history.push(`/dashboard?date=${reservationData.reservation_date}`);
        }
        setErrors(foundErrors);
    }

    const renderedErrors = () => {
        return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
    }
    return (
        <form onSubmit={handleSubmit}>
            {renderedErrors()}
            <div>
                <label htmlFor="first_name">First Name:&nbsp;</label>
                <input 
                    name="first_name"
                    id="first_name"
                    type="text"
                    onChange={handleChange}
                    value={reservationData.first_name}
                    // required
                />
            </div>

            <div>
                <label htmlFor="last_name">Last Name:&nbsp;</label>
                <input 
                    name="last_name"
                    id="last_name"
                    type="text"
                    onChange={handleChange}
                    value={reservationData.last_name}
                    // required
                />
            </div>

            <div>
                <label htmlFor="mobile_number">Mobile Number:&nbsp;</label>
                <input 
                    name="mobile_number"
                    id="mobile_number"
                    type="text"
                    onChange={handleChange}
                    value={reservationData.mobile_number}
                    // required
                />
            </div>
			
            <div>
                <label htmlFor="reservation_date">Reservation Date:&nbsp;</label>
                <input 
                    name="reservation_date" 
                    id="reservation_date"
                    type="date"
                    onChange={handleChange}
                    value={reservationData.reservation_date}
                    // required
                />
            </div>
			
            <div>
                <label htmlFor="reservation_time">Reservation Time:&nbsp;</label>
                <input 
                    name="reservation_time" 
                    id="reservation_time"
                    type="time"
                    onChange={handleChange}
                    value={reservationData.reservation_time}
                    // required
                />
            </div>
			
            <div>
                <label htmlFor="people">Party Size:&nbsp;</label>
                <input 
                    name="people"
                    id="people"
                    type="number"
                    min="1"
                    onChange={handleChange}
                    value={reservationData.people}
                    // required
                />
            </div>

			<button type="submit" >Submit</button>
			<button type="button" onClick={history.goBack}>Cancel</button>
		</form>
    )
}
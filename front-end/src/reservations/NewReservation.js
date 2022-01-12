import React, { useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";


export default function NewReservation() {
    const history = useHistory()
    const initialReservation = {
        first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_date: "",
		reservation_time: "",
		people: "",
    }

    // Working on validation
    const [errors, setErrors] = useState([]);
    const validateDate = () => {
        const reserveDate = new Date(reservationData.reservation_date);
        const todaysDate = new Date()
        const foundErrors = [];
        // the Date class has many functions, one of which returns the day (0 is sunday, 6 is saturday)
        if (reserveDate.getDay() === 2) {
            foundErrors.push({ message: "Reservations cannot be made on a Tuesday (Restaurant is closed)." });
        }
        if (reserveDate < todaysDate) {
            foundErrors.push({ message: "Reservations cannot be made in the past." });
        }
        setErrors(foundErrors);
        if(foundErrors.length > 0) {
            return false;
        }
        // if we get here, our reservation date is valid!
        return true;
    }

    const [reservationData, setReservationData] = useState(initialReservation)
    const handleChange = ({target: {name,value}}) => {
        setReservationData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if(validateDate()) {
            history.push(`/dashboard?date=${reservationData.reservation_date}`);
        }
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
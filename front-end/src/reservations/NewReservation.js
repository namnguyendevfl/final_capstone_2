import React, { useState } from "react";
import { useHistory, useParams } from "react-router";


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

    const [reservationData, setReservationData] = useState(initialReservation)
    const handleChange = ({target: {name,value}}) => {
        setReservationData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`/dashboard?date=${reservationData.reservation_date}`)
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="first_name">First Name:&nbsp;</label>
                <input 
                    name="first_name"
                    id="first_name"
                    type="text"
                    onChange={handleChange}
                    value={reservationData.first_name}
                    required
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
                    required
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
                    required
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
                    required
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
                    required
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
                    required
                />
            </div>

			<button type="submit" >Submit</button>
			<button type="button" onClick={history.goBack}>Cancel</button>
		</form>
    )
}
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation, editReservation, listReservations } from "../utils/api";

export default function NewReservation({edit, reservations, loadDashboard}) {
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
    const [errors, setErrors] = useState([]);
	const [apiError, setApiError] = useState(null);
	const [reservationsError, setReservationsError] = useState(null);

    useEffect(() => {
		if(edit) {
			if(!reservation_id) return null;

			loadReservations()
				.then((response) => response.find((reservation) => 
					reservation.reservation_id === Number(reservation_id)))
				.then(fillFields);
		}

		function fillFields(foundReservation) {
			if(!foundReservation || foundReservation.status !== "booked") {
				return <p>Only booked reservations can be edited.</p>;
			}

			const date = new Date(foundReservation.reservation_date);
			const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + (date.getDate())).slice(-2)}`;
	
			setReservationData({
				first_name: foundReservation.first_name,
				last_name: foundReservation.last_name,
				mobile_number: foundReservation.mobile_number,
				reservation_date: dateString,
				reservation_time: foundReservation.reservation_time,
				people: foundReservation.people,
			});
		}

		async function loadReservations() {
			const abortController = new AbortController();
			return await listReservations(null, abortController.signal)
				.catch(setReservationsError);
		}
	}, [edit, reservation_id]);


    const validateDate = (foundErrors) => {
        const reserveDate = new Date(`${reservationData.reservation_date}T${reservationData.reservation_time}:00.000`)
        const todaysDate = new Date()
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
            [name]: name === "people" ? Number(value) : value
        }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
		const abortController = new AbortController();
        const foundErrors = []
        if(validateDate(foundErrors) && validateFields(foundErrors)) {
            if(edit) {
				editReservation(reservation_id, reservationData, abortController.signal)
					.then(loadDashboard)
					.then(() => history.push(`/dashboard?date=${reservationData.reservation_date}`))
					.catch(setApiError);
			}
			else {
				createReservation(reservationData, abortController.signal)
					.then(loadDashboard)
					.then(() => history.push(`/dashboard?date=${reservationData.reservation_date}`))
					.catch(setApiError);
			}
        }
        setErrors(foundErrors);
    }

    const renderedErrors = () => {
        return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
    }
    return (
        <form onSubmit={handleSubmit}>
            {renderedErrors()}
			<ErrorAlert error={apiError} />
			<ErrorAlert error={reservationsError} />

            <div>
                <label className="form-label" htmlFor="first_name">First Name:&nbsp;</label>
                <input 
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
                    name="people"
                    id="people"
                    type="number"
                    min="1"
                    onChange={handleChange}
                    value={reservationData.people}
                    // required
                />
            </div>

			<button className="btn btn-primary m-1" type="submit" >Submit</button>
			<button className="btn btn-danger m-1" type="button" onClick={history.goBack}>Cancel</button>
		</form>
    )
}
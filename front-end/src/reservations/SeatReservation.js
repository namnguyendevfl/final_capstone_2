import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, seatTable } from "../utils/api";

export default function SeatReservation({ tables, loadDashboard }) {
    const history = useHistory();
	const [tableId, setTableId] = useState(0);
	const [reservations, setReservations] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);
	const [errors, setErrors] = useState([]);
	const [apiError, setApiError] = useState(null);
	const { reservation_id } = useParams();

	useEffect(() => {
    	const abortController = new AbortController();

    	setReservationsError(null);

    	listReservations(null, abortController.signal)
      		.then(setReservations)
      		.catch(setReservationsError);

    	return () => abortController.abort();
  	}, []);

	if(!tables || !reservations) return null;

	const handleChange = ({ target: {value} }) => {
		setTableId(value);
	}
	const handleSubmit = (e) => {
		e.preventDefault();
		const abortController = new AbortController();

		if(validateSeat()) {
			seatTable(reservation_id, tableId, abortController.signal)
				.then(loadDashboard)
				.then(() => history.push(`/dashboard`))
				.catch(setApiError);
		}
	}

	const validateSeat = () => {
		const foundErrors = [];
		const foundTable = tables.find((table) => table.table_id === Number(tableId));
		const foundReservation = reservations.find((reservation) => reservation.reservation_id === Number(reservation_id));
		if(!foundTable) {
			foundErrors.push("The table you selected does not exist.");
		}
		else if(!foundReservation) {
			foundErrors.push("This reservation does not exist.")
		}
		else {
			if(foundTable.status === "occupied") {
				foundErrors.push("The table you selected is currently occupied.")
			}

			if(foundTable.capacity < foundReservation.people) {
				foundErrors.push(`The table you selected cannot seat ${foundReservation.people} people.`)
			}
		}
		setErrors(foundErrors);
		return foundErrors.length === 0;
		
	}

    const renderedTableOptions = () => {
        return tables.map((table, idx) => 
            <option key = {idx} value={table.table_id}>{table.table_name} - {table.capacity}</option>);
    };

	const renderedErrors = () => {
		return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
	};
	return (
		<form onSubmit = {handleSubmit}>
			{renderedErrors()}
			<ErrorAlert error={apiError} />
			<ErrorAlert error={reservationsError} />
		<label htmlFor="table_id">Choose table:</label>
		<select 
			className="form-control"
			name="table_id" 
			id="table_id"
            value={tableId}
			onChange={handleChange}
		>	
			<option value = "">Select a table</option>
            {renderedTableOptions()}
		</select>

		<button className="btn btn-primary m-1" type="submit" >Submit</button>
		<button className="btn btn-danger m-1" type="button" onClick={history.goBack}>Cancel</button>
	</form>
	);
}
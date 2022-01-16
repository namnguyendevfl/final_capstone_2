import React from "react";
import { Link } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";

export default function ReservationRow({ reservation, loadDashboard }) {
	// returning "null" inside of a react component basically means return nothing. however, we always want to make sure we return null if we intend to return nothing.
	if(!reservation) return null;

    const handleCancel = () => {
        if(window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            const abortController = new AbortController();

			updateReservationStatus(reservation.reservation_id, "cancelled", abortController.status)
				.then(loadDashboard);

			return () => abortController.abort();
        }
	}
	return (
		<tr>
			{ /* because the reservation id is a primary key, i figured i would make this a sort of table header (recall it basically just makes the test bold */ }
			<th scope="row">{reservation.reservation_id}</th>
			
			{ /* for everything else, i use "td", which means table data. */ }
			<td>{reservation.first_name}</td>
			<td>{reservation.last_name}</td>
			<td>{reservation.mobile_number}</td>
			<td>{reservation.reservation_time}</td>
			<td>{reservation.people}</td>
			{/* <td>{reservation.status}</td> */}
			<td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>	

			{reservation.status === "booked" &&
				<>
					<td>
						<Link to={`/reservations/${reservation.reservation_id}/edit`}>
							<button className="btn btn-secondary" type="button">Edit</button>
						</Link>
					</td>

					<td>
						<button className="btn btn-danger" type="button" onClick={handleCancel} data-reservation-id-cancel={reservation.reservation_id}>
							Cancel
						</button>
					</td>

					<td>
						<a href={`/reservations/${reservation.reservation_id}/seat`}>
							<button className="btn btn-primary" type="button">Seat</button>
						</a>
					</td>
				</>
			}
		</tr>
	);
}
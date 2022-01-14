import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import { useHistory } from "react-router";
import ReservationRow from "./ReservationRow";
import TableRow from "./TableRow";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date, reservations, reservationsError, tables, tablesError, loadDashboard }) {
  console.log(reservations)
  const history = useHistory();

  const renderedReservationBody = () => {
    return reservations.map((reservation) => 
			<ReservationRow key={reservation.reservation_id} reservation={reservation} loadDashboard={loadDashboard} />);
	};

  const renderedTableBody = () => {
    return tables.map((table) => 
			<TableRow key={table.table_id} table={table} loadDashboard={loadDashboard} />);
	};

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <table className="table">
			<thead>
				<tr>
					<th scope="col">ID</th>
					<th scope="col">First Name</th>
					<th scope="col">Last Name</th>
					<th scope="col">Mobile Number</th>
					<th scope="col">Time</th>
					<th scope="col">People</th>
					<th scope="col">Status</th>
          <th scope="col">Edit</th>
			    <th scope="col">Cancel</th>
					<th scope="col">Seat Table</th>
				</tr>
			</thead>
			
			<tbody>
        {renderedReservationBody()}
				{ /* i am currently planning on creating a special component that will format the reservation information as a table row (<tr>) */ }
			</tbody>
		</table>
      
		<h4 className="mb-0">Tables</h4>

		<ErrorAlert error={tablesError} />

		<table className="table">
			<thead>
				<tr>
					<th scope="col">ID</th>
					<th scope="col">Table Name</th>
					<th scope="col">Capacity</th>
					<th scope="col">Status</th>
				</tr>
			</thead>
				
			<tbody>
        {renderedTableBody()}
			</tbody>
		</table>
      <button type="button" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous</button>
			<button type="button" onClick={() => history.push(`/dashboard?date=${today()}`)}>Today</button>
			<button type="button" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
    </main>
  );
}

export default Dashboard;

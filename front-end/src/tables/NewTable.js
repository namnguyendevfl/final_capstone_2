import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert"
import { createTable } from "../utils/api";

export default function NewTable({loadDashboard}) {
	const history = useHistory();

	const [error, setError] = useState(null);
    const initialTable = {
        table_name: "",
		capacity: 1,
    }
	const [tableData, setTableData] = useState(initialTable);

	const handleChange = ({ target: { name, value } }) => {
		setTableData(prevData => ({ ...prevData, [name]: value }));
	}

	const handleSubmit = (e) => {
		e.preventDefault();
        const abortController = new AbortController()
        
		if(validateFields()) {
			createTable(tableData, abortController.signal)
				.then(loadDashboard)
				.then(() => history.push(`/dashboard`))
				.catch(setError);
		}
	}

	function validateFields() {
		let foundError = null;

		if(tableData.table_name === "" || tableData.capacity === "") {
			foundError = { message: "Please fill out all fields." };
		}
		else if(tableData.table_name.length < 2) {
			foundError = { message: "Table name must be at least 2 characters." };
		}

		setError(foundError);

		return foundError === null;
	}

    console.log(error)
	return (
		<form onSubmit={handleSubmit}>
			<ErrorAlert error={error} />
            <div>
                <label htmlFor="table_name">Table Name:&nbsp;</label>
                <input 
                    className="form-control"
                    name="table_name"
                    id="table_name"
                    type="text"
                    minLength="2"
                    onChange={handleChange}
                    value={tableData.table_name}
                    // required
                />
            </div>
			
            <div>
                <label htmlFor="capacity">Capacity:&nbsp;</label>
                <input 
                    className="form-control"
                    name="capacity"
                    id="capacity"
                    type="number"
                    min="1"
                    onChange={handleChange}
                    value={tableData.capacity}
                    // required
                />
            </div>
			
            <div>
                <button className="btn btn-primary m-1" type="submit" >Submit</button>
                <button className="btn btn-danger m-1" type="button" onClick={history.goBack}>Cancel</button>
            </div>
		</form>
	);
}
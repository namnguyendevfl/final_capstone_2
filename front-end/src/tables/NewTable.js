import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert"

export default function NewTable() {
	const history = useHistory();

	const [error, setError] = useState([]);
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

        console.log(validateFields())
		if(validateFields()) {
			history.push(`/dashboard`);
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

	return (
		<form onSubmit={handleSubmit}>
			<ErrorAlert error={error} />
            <div>
                <label htmlFor="table_name">Table Name:&nbsp;</label>
                <input 
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
                <button type="submit" >Submit</button>
                <button type="button" onClick={history.goBack}>Cancel</button>
            </div>
		</form>
	);
}
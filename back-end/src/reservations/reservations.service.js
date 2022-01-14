const knex = require("../db/connection");

const tableName = "reservations";

function list(date) {
	if(date) {
		return knex(tableName)
			.select("*")
			.where({ reservation_date: date })
			.orderBy("reservation_time", "asc");
	}

	return knex(tableName)
		.select("*");
}

function create(reservation) {
	return knex(tableName)
		.insert(reservation)
		.returning("*");
}

function read(reservation_id) {
    return knex(tableName)
        .select("*")
        .where({ reservation_id: reservation_id })
        .first();
}
function update(reservation_id, status) {
    return knex(tableName)
        .where({ reservation_id: reservation_id })
        .update({ status: status });
}

module.exports = {
    list,
    create,
	read,
	update
}
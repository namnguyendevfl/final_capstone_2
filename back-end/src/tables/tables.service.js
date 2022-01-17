const knex = require("../db/connection");
const tableName = "tables";

const list = () => {
        return knex(tableName).select("*").orderBy("table_name", "asc");
};

const create = (newTable) => {
    return  knex(tableName)
            .insert(newTable)
            .returning("*")
}

const free = (table_id) => {
    return  knex(tableName)
            .where({table_id})
            .update({ reservation_id: null, status: "free" });
}

const updateReservation = (reservation_id, status) => {
    return knex("reservations")
        .where({ reservation_id: reservation_id })
        .update({ status: status });
}

const occupy = (table_id, reservation_id) => {
    return knex(tableName)
        .where({ table_id: table_id })
        .update({ reservation_id: reservation_id , status: "occupied" });
}

function read(table_id) {
    return knex(tableName)
        .select("*")
        .where({ table_id: table_id })
        .first();
}

function readReservation(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservation_id })
        .first();
}

module.exports = {
    list,
    create,
    free,
    updateReservation,
    occupy,
    read,
    readReservation
}
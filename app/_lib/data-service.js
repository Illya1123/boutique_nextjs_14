import { notFound } from 'next/navigation'
import { eachDayOfInterval } from 'date-fns'
import { pool } from './db'

/////////////
// GET

export async function getCabin(id) {
    try {
        const { rows } = await pool.query('SELECT * FROM cabins WHERE id = $1', [id])
        if (rows.length === 0) notFound()
        return rows[0]
    } catch (error) {
        console.error(error)
        notFound()
    }
}

export async function getCabinPrice(id) {
    try {
        const { rows } = await pool.query(
            'SELECT regularPrice, discount FROM cabins WHERE id = $1',
            [id]
        )
        return rows[0]
    } catch (error) {
        console.error(error)
    }
}

export async function getCabins() {
    try {
        const { rows } = await pool.query(
            'SELECT id, name, maxCapacity, regularPrice, discount, image FROM cabins ORDER BY name'
        )
        return rows
    } catch (error) {
        console.error(error)
        throw new Error('Cabins could not be loaded')
    }
}

// Guests are uniquely identified by their email address
export async function getGuest(email) {
    const { rows } = await pool.query('SELECT * FROM guests WHERE email = $1', [email])
    return rows[0] || null
}

export async function getBooking(id) {
    try {
        const { rows } = await pool.query('SELECT * FROM bookings WHERE id = $1', [id])
        return rows[0]
    } catch (error) {
        console.error(error)
        throw new Error('Booking could not get loaded')
    }
}

export async function getBookings(guestId) {
    try {
        const { rows } = await pool.query(
            `SELECT b.id, b.created_at, b.startDate, b.endDate, b.numNights, b.numGuests,
              b.totalPrice, b.guestId, b.cabinId,
              c.name as cabin_name, c.image as cabin_image
       FROM bookings b
       JOIN cabins c ON b.cabinId = c.id
       WHERE b.guestId = $1
       ORDER BY b.startDate`,
            [guestId]
        )
        return rows
    } catch (error) {
        console.error(error)
        throw new Error('Bookings could not get loaded')
    }
}

export async function getBookedDatesByCabinId(cabinId) {
    try {
        let today = new Date()
        today.setUTCHours(0, 0, 0, 0)

        const { rows } = await pool.query(
            "SELECT * FROM bookings WHERE cabinId = $1 AND (startDate >= $2 OR status = 'checked-in')",
            [cabinId, today.toISOString()]
        )

        const bookedDates = rows
            .map((booking) =>
                eachDayOfInterval({
                    start: new Date(booking.startdate),
                    end: new Date(booking.enddate),
                })
            )
            .flat()

        return bookedDates
    } catch (error) {
        console.error(error)
        throw new Error('Bookings could not get loaded')
    }
}

export async function getSettings() {
    try {
        const { rows } = await pool.query('SELECT * FROM settings LIMIT 1')
        return rows[0]
    } catch (error) {
        console.error(error)
        throw new Error('Settings could not be loaded')
    }
}

export async function getCountries() {
    try {
        const res = await fetch('https://restcountries.com/v2/all?fields=name,flag')
        return await res.json()
    } catch {
        throw new Error('Could not fetch countries')
    }
}

/////////////
// CREATE

export async function createGuest(newGuest) {
    try {
        const { rows } = await pool.query(
            `INSERT INTO guests (fullName, email, nationalID)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [newGuest.fullName, newGuest.email, newGuest.nationalID]
        )
        return rows[0]
    } catch (error) {
        console.error(error)
        throw new Error('Guest could not be created')
    }
}

/////////////
// UPDATE

export async function updateGuest(id, updatedFields) {
    try {
        const keys = Object.keys(updatedFields)
        const values = Object.values(updatedFields)

        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ')

        const { rows } = await pool.query(
            `UPDATE guests SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        )

        return rows[0]
    } catch (error) {
        console.error(error)
        throw new Error('Guest could not be updated')
    }
}

export async function updateBooking(id, updatedFields) {
    try {
        const keys = Object.keys(updatedFields)
        const values = Object.values(updatedFields)

        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ')

        const { rows } = await pool.query(
            `UPDATE bookings SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        )

        return rows[0]
    } catch (error) {
        console.error(error)
        throw new Error('Booking could not be updated')
    }
}

/////////////
// DELETE

export async function deleteBooking(id) {
    try {
        await pool.query('DELETE FROM bookings WHERE id = $1', [id])
        return true
    } catch (error) {
        console.error(error)
        throw new Error('Booking could not be deleted')
    }
}

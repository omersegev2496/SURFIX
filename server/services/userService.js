const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { dbConnection } = require('../db_connection');

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'secret';

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    authenticateUser,
    isUserExists
}

async function query(filters = {}) {
    try {
        const connection = await dbConnection.connect();
        let whereClause = '';
        let sortClause = '';
        const values = [];

        if (filters) {
            if (filters.fullName) {
                if (whereClause) whereClause += ' AND ';
                whereClause += `fullName LIKE CONCAT('%', ?, '%')`;
                values.push(filters.fullName);
            }

            if (filters.sortByName) {
                sortClause += ' ORDER BY fullName ASC;';
            }
        }

        let sql = `SELECT userId, userName, fullName, email, age, surfingLevel, weight, height, stars, waveLeft, waveRight, rowing, speed, role FROM tbl_122_user`;

        if (whereClause) {
            sql += ` WHERE (${whereClause})`;
        }

        if (sortClause) {
            sql += sortClause;
        }

        const [rows] = await connection.execute(sql, values);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

async function getById(userId) {
    try {
        const connection = await dbConnection.connect();
        const [rows] = await connection.execute(`SELECT userId, userName, fullName, email, age, surfingLevel, weight, height, stars, waveLeft, waveRight, rowing, speed, role FROM tbl_122_user WHERE userId = '${userId}'`);
        if (rows.length === 0) {
            throw new Error('User not found');
        }
        return rows[0];
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
}

async function add(body) {
    try {
        const connection = await dbConnection.connect();
        const { userName, fullName, email, password, age, surfingLevel, weight, height, role } = body;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [result] = await connection.execute(
            `INSERT INTO tbl_122_user (userName, fullName, email, password, age, surfingLevel, weight, height,role) VALUES ("${userName}","${fullName}","${email}","${hashedPassword}",${age},"${surfingLevel}",${weight},${height},"${role}")`);
        return { userName, fullName, email, age, surfingLevel, weight, height, role };
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

async function update(body, userId) {
    try {
        const connection = await dbConnection.connect();
        
        const {
            userName,
            fullName,
            email,
            password,
            age,
            surfingLevel,
            weight,
            height,
            stars,
            waveLeft,
            waveRight,
            rowing,
            speed,
            role
        } = body;

        let updateParts = [];

        if (userName) {
            updateParts.push(`userName = '${userName}'`);
        }
        if (fullName) {
            updateParts.push(`fullName = '${fullName}'`);
        }
        if (email) {
            updateParts.push(`email = '${email}'`);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateParts.push(`password = '${hashedPassword}'`);
        }
        if (age) {
            updateParts.push(`age = ${age}`);
        }
        if (surfingLevel) {
            updateParts.push(`surfingLevel = '${surfingLevel}'`);
        }
        if (weight) {
            updateParts.push(`weight = ${weight}`);
        }
        if (height) {
            updateParts.push(`height = ${height}`);
        }
        if (stars) {
            updateParts.push(`stars = ${stars}`);
        }
        if (role) {
            updateParts.push(`role = '${role}'`);
        }
        if (waveLeft) {
            updateParts.push(`waveLeft = ${waveLeft}`);
        }
        if (waveRight) {
            updateParts.push(`waveRight = ${waveRight}`);
        }
        if (rowing) {
            updateParts.push(`rowing = ${rowing}`);
        }
        if (speed) {
            updateParts.push(`speed = ${speed}`);
        }
        if (updateParts.length === 0) {
            throw new Error('No fields to update');
        }

        const [result] = await connection.execute(`UPDATE tbl_122_user SET ${updateParts.join(', ')} WHERE userId = ${userId}`);

        return {
            userId,
            ...(userName && { userName }),
            ...(fullName && { fullName }),
            ...(email && { email }),
            ...(age && { age }),
            ...(surfingLevel && { surfingLevel }),
            ...(weight && { weight }),
            ...(height && { height }),
            ...(stars && { stars }),
            ...(waveLeft && { waveLeft }),
            ...(waveRight && { waveRight }),
            ...(rowing && { rowing }),
            ...(speed && { speed }),
            ...(role && { role }),
        };
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

async function remove(userId) {
    try {
        const connection = await dbConnection.connect();
        const [result] = await connection.execute(`DELETE FROM tbl_122_user WHERE userId = '${userId}'`);
        return { message: 'User deleted successfully' };
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

async function authenticateUser(email, password) {
    try {
        const connection = await dbConnection.connect();

        const [rows] = await connection.execute(`SELECT * FROM tbl_122_user WHERE email="${email}"`);
        if (rows.length === 0) {
            throw new Error('User not found, email, password');
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign(
            {
                userId: user.userId,
                userName: user.userName,
                userRole: user.role
            },
            jwtSecret,
            { expiresIn: '1d' }
        );

        return {
            userId: user.userId,
            userName: user.userName,
            token,
        };
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw error;
    }
}

async function isUserExists(userName, email) {
    try {
        const connection = await dbConnection.connect();
        const [rows] = await connection.execute(
            `SELECT COUNT(*) AS count FROM tbl_122_user WHERE userName='${userName}' OR email='${email}'`);
        return rows[0].count > 0;
    } catch (error) {
        console.error('Error checking if user exists:', error);
        throw error;
    }
}
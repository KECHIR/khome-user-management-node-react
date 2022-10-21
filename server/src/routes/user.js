import express from 'express';
import { emptyObject } from '../helpers.js';
import { validationSchema } from '../validation/validation-user-data.js';
import { toOid, isStrOid } from '../helpers.js';

export function userRouteur(mongoDbCrud) {

    const router = express.Router();

    const validateUserData = async (userData) => {
        let errors = [];
        try {
            await validationSchema.validate(userData, { abortEarly: false });
        } catch (err) {
            err.inner.forEach(element => {
                errors.push({ name: element.path, message: element.message })
            });
        }
        return { ok: !errors.length, errors }
    };

    /**
     * @swagger
     * /user/add:
     *   post:
     *     summary: Create a new user
     *     tags: [user]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/user'
     *     responses:
     *       200:
     *         description: The user was successfully created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/user'
     *       500:
     *         description: Some server error
     */
    router.post('/add', function (req, res) {
        (async () => {
            const userData = req.body || {};
            const { email } = userData;
            // Check when body no content
            if (emptyObject(userData)) {
                return res.status(304).json({ ok: false, level: 'error', status: 304, errors: [{ message: "No Content : lastName,firstName,email are required for create user" }] });
            }
            // Validate user data
            const validationUserDataRes = await validateUserData(userData);
            if (!validationUserDataRes.ok) {
                return res.status(304).json({ ok: false, level: 'error', status: 304, errors: validationUserDataRes.errors });
            }
            // Will check if user not already exist
            const userFounded = await mongoDbCrud.findOne('users', { email });
            if (!emptyObject(userFounded)) {
                return res.status(409).json({ ok: false, level: 'error', status: 409, errors: [{ message: `409 Conflict : user: email:${email} already exist ` }] });
            }
            // Create user
            const createUserRes = await mongoDbCrud.insertOne('users', userData);
            if (!createUserRes.acknowledged) {
                return res.status(500).json({ ...createUserRes, ok: false, status: 500, errors: [{ message: `Failed creating user lastName${userData.lastName}, email${userData.email}` }] });
            }
            return res.status(200).json({ ok: true, status: 200, data: { userId: createUserRes.insertedId, ...userData }, message: "User successfully created!" });
        })();
    });

    /**
 * @swagger
 * /user/update:
 *  put:
 *    summary: Update the user
 *    tags: [user]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/user'
 *    responses:
 *      200:
 *        description: The user was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/user'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */

    router.put('/update', function (req, res) {
        (async () => {
            const userData = req.body || {};
            const { email, userId, firstName, lastName } = userData;
            // Check when body no content
            if (emptyObject(userData)) {
                return res.status(304).json({ ok: false, level: 'error', status: 304, errors: [{ message: "No Content : lastName,firstName,email are required for create user" }] });
            }
            // Validate user data
            const validationUserDataRes = await validateUserData(userData);
            if (!validationUserDataRes.ok) {
                return res.status(304).json({ ok: false, level: 'error', status: 304, errors: validationUserDataRes.errors });
            }
            // Create user
            const updateUserRes = await mongoDbCrud.updateOne('users', { email, _id: toOid(userId) }, {
                $set: { "email": email, "firstName": firstName, "lastName": lastName }
            });
            if (!updateUserRes.acknowledged) {
                return res.status(500).json({ ...updateUserRes, ok: false, status: 500, errors: [{ message: `Failed updating user lastName${userData.lastName}, email${userData.email}` }] });
            }
            return res.status(200).json({ ok: true, status: 200, data: { userId: updateUserRes.insertedId, ...userData }, message: "User successfully updated!" });
        })();
    });

    router.delete('/delete', async function (req, res) {
        const usersToDelete = req.body || [];
        if (!usersToDelete.length) {
            return res.status(304).json({ ok: false, level: 'error', status: 304, errors: [{ message: "Noting to delete" }] });
        }
        const usersDelete = await mongoDbCrud.deleteMany('users', { _id: { $in: usersToDelete.map(u => toOid(u._id)) } });
        if (!usersDelete.acknowledged) {
            return res.status(500).json({ ...createUserRes, data: usersToDelete, ok: false, status: 500, errors: [{ message: `Failed to deleting users` }] });
        }
        return res.status(200).json({ ok: true, status: 200, message: "Users successfully deleted!" });
    });

    router.get('/all-users', function (req, res) {
        (async function () {
            const addOfferRes = await mongoDbCrud.find('users');
            return res.status(200).json({ ok: true, status: 200, data: addOfferRes });
        })();
    });

    router.get('/:userId', function (req, res) {
        (async function () {
            const userId = req.params.userId;
            if (!isStrOid(userId)) {
                return res.status(404).send({ ok: false, level: 'error', status: 404, message: `${userId} :Invalid user id` });
            }
            const userFounded = await mongoDbCrud.findOne('users', { _id: toOid(userId) }) || {};
            if (emptyObject(userFounded)) {
                return res.status(404).json({ ok: false, level: 'error', status: 404, errors: [{ message: `${userId}:User not fond` }] });
            }
            return res.status(200).json({ ok: true, status: 200, data: userFounded });
        })();
    });

    return { router };
}




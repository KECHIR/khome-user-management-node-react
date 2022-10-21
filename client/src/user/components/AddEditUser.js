
import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import FormikTextInput from './FormikTextInput.js';
import { useParams } from 'react-router-dom';
import { initialValues, validationSchema } from '../models/userModel.js';
import { create, fetchUser, update } from '../services/userService.js';
import AlertNotification from './AlertNotification.js' //toast
import { useNavigate } from "react-router-dom";

export default function AddEditUser() {

    const { userId } = useParams();
    const navigate = useNavigate();
    const isAddMode = !userId;
    const [initialUserValues, setInitialUserValues] = useState(initialValues);
    const [isExistUser, setIsExistUser] = useState(false);

    useEffect(() => {
        if (!isAddMode) {
            (async () => {
                const response = await fetchUser(userId);
                if (response.ok) {
                    const { lastName, firstName, email } = response.data || {};
                    const userDataFromDb = { lastName, firstName, email };
                    setInitialUserValues(userDataFromDb);
                    setIsExistUser(true);
                }
            })();
        }
    }, [isAddMode, userId]); // mais peut étre ça sera suprimée à la main en base ! danger

    const initAlertNotificationInfos = { ok: false };
    const [alertNotificationInfos, setAlertNotificationInfos] = useState(initAlertNotificationInfos);

    const handleCloseAlerNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertNotificationInfos(initAlertNotificationInfos);
    };

    const navigateToEditUser = (userId) => {
        navigate(`/user/edit/${userId}`);
    };

    const createUser = async (userData) => {
        // res : response
        const res = await create(userData);
        if (res.ok) {
            setAlertNotificationInfos({ ok: true, message: "L'utilisateur est créé avec succès ", severity: "success" });
            navigateToEditUser(res.data.userId);
        } else {
            setAlertNotificationInfos({ ok: true, message: res.errors.map(err => err.message).join('/n'), severity: "error" });
        }
        return res;
    };

    const addNewUser = () => {
        setInitialUserValues(initialValues);
        navigate('/user/add');
    };

    const updateUser = async (userData) => {
        const res = await update({ ...userData, userId });
        if (res.ok) {
            setAlertNotificationInfos({ ok: true, message: "L'utilisateur est mis à jour avec succès ", severity: "success" });
            setInitialUserValues(userData);

        } else {
            setAlertNotificationInfos({ ok: true, message: res.errors.map(err => err.message).join('/n'), severity: "error" });
        }
        return res;

    };

    const handleSubmit = async (userData, { resetForm }) => {
        if (isAddMode) {
            const res = await createUser(userData);
            if (res.ok) {
                resetForm({});
            }
        } else {
            await updateUser(userData);
        }
    };

    const handleDisablingSubmitBtn = (formik) => {
        return isAddMode ? !formik.isValid : !(formik.isValid && formik.dirty);
    }

    return <div className='form-user'>
        {alertNotificationInfos.ok ? <AlertNotification severity={alertNotificationInfos.severity} open={true} message={alertNotificationInfos.message} handleClose={handleCloseAlerNotification} /> : null}
        {!isAddMode && !isExistUser ? <span>Utilisateur inconnue</span> :
            <Formik enableReinitialize={true} initialValues={initialUserValues} onSubmit={handleSubmit} validationSchema={validationSchema} >
                {
                    (formik) => (
                        
                        <Form >
                            <h1> {isAddMode ? "Ajout d'un utilisateur":"Modification utilisateur"} </h1>
                            <div className='align-horizontally'>
                                <FormikTextInput fieldClassName='tds-form-input' labelName="Nom*" type="text" id="lastName" name="lastName" component="input" />
                                <FormikTextInput fieldClassName='tds-form-input' labelName="Prénom*" type="text" id="firstName" name="firstName" component="input" />
                            </div>
                            <FormikTextInput fieldClassName='tds-form-input' labelName="Email*" type="text" id="email" name="email" component="input" />
                            <div className='align-horizontally'>
                                <div className='from-field-wrap'>
                                    <button disabled={handleDisablingSubmitBtn(formik)} className={handleDisablingSubmitBtn(formik) ? 'btn-disabled' : 'btn'}  >{isAddMode ? "Ajouter l'utilisateur" : `Mettre à jour l'utilisteur`}</button>
                                </div >
                                {!isAddMode ? <div className='from-field-wrap'>
                                    <button className={'btn'} onClick={() => addNewUser()} >Ajouter un nouveau utilisateur</button>
                                </div> : null}
                            </div>
                            <div>

                            </div>
                        </Form>
                    )
                }
            </Formik>
        }
    </div>;
}
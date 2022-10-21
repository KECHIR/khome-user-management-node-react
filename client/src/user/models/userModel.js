import * as Yup from 'yup';

const initialValues = { lastName: "", firstName: "", email: "" };

const validationSchema = Yup.object().shape({
    lastName: Yup.string().required("Le nom de l'utilisateur est obligatoire"),
    firstName: Yup.string().required("Le prénom de l'utilisateur est obligatoire"),
    email: Yup.string().required("L'adresse e-mail est obligatoire ").email('Veuillez entrer une adresse e-mail valide'),
});

export { initialValues, validationSchema };


import { useState, useRef } from "react";
import styles from "./App.module.css";

const initialFieldState = {
  value: "",
  error: null,
  valid: false,
  touched: false,
};

const App = () => {
  const [fields, setFields] = useState({
    email: { ...initialFieldState },
    password: { ...initialFieldState },
    confirmPassword: { ...initialFieldState },
  });

  const submitButtonRef = useRef(null);

  const handleInputChange = (event, fieldName) => {
    const value = event.target.value;
    setFields((prevFields) => ({
      ...prevFields,
      [fieldName]: {
        ...prevFields[fieldName],
        value,
      },
    }));

    validateField(fieldName, value);
  };

  const handleInputBlur = (fieldName) => {
    setFields((prevFields) => ({
      ...prevFields,
      [fieldName]: {
        ...prevFields[fieldName],
        touched: true,
      },
    }));
  };

  const validateField = (fieldName, value) => {
    let isValid = true;
    let error = null;

    if (fieldName === "email") {
      isValid = value.includes("@");
      error = isValid ? null : "Введите корректный email";
    } else if (fieldName === "password") {
      isValid = value.length >= 6;
      error = isValid ? null : "Пароль должен содержать минимум 6 символов";
    } else if (fieldName === "confirmPassword") {
      isValid = value === fields.password.value;
      error = isValid ? null : "Пароли не совпадают";
    }

    setFields((prevFields) => ({
      ...prevFields,
      [fieldName]: {
        ...prevFields[fieldName],
        valid: isValid,
        error: error,
      },
    }));
  };

  const resetForm = () => {
    setFields({
      email: { ...initialFieldState },
      password: { ...initialFieldState },
      confirmPassword: { ...initialFieldState },
    });

    if (submitButtonRef.current) {
      submitButtonRef.current.blur();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { email, password, confirmPassword } = fields;

    if (!email.valid || !password.valid || !confirmPassword.valid) {
      console.log(
        "Форма содержит ошибки. Пожалуйста, исправьте их перед отправкой."
      );
      return;
    }

    console.log("Email:", email.value);
    console.log("Password:", password.value);
    console.log("Confirm Password:", confirmPassword.value);

    resetForm();
  };

  return (
    <div className={styles.app}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {["email", "password", "confirmPassword"].map((fieldName) => (
          <div key={fieldName}>
            {fields[fieldName].error && fields[fieldName].touched && (
              <div className={styles.errorLabel}>{fields[fieldName].error}</div>
            )}
            <input
              type={fieldName === "email" ? "email" : "password"}
              name={fieldName}
              value={fields[fieldName].value}
              placeholder={
                fieldName === "confirmPassword"
                  ? "Confirm Password"
                  : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
              }
              onChange={(event) => handleInputChange(event, fieldName)}
              onBlur={() => handleInputBlur(fieldName)}
              className={`${styles.input} ${
                fields[fieldName].error && fields[fieldName].touched
                  ? styles.invalid
                  : ""
              }`}
              disabled={fields[fieldName].valid}
            />
          </div>
        ))}

        <button
          type="submit"
          ref={submitButtonRef}
          className={`${styles.button} ${
            fields.email.valid &&
            fields.password.valid &&
            fields.confirmPassword.valid
              ? styles.valid
              : ""
          }`}
          disabled={
            !fields.email.valid ||
            !fields.password.valid ||
            !fields.confirmPassword.valid
          }
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default App;

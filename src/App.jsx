import { useState, useRef, useEffect } from "react";
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

  useEffect(() => {
    if (
      fields.email.valid &&
      fields.password.valid &&
      fields.confirmPassword.valid &&
      submitButtonRef.current
    ) {
      submitButtonRef.current.focus();
    }
  }, [fields.email.valid, fields.password.valid, fields.confirmPassword.valid]);

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    validateField(name, value);
    setFields((prevFields) => ({
      ...prevFields,
      [name]: {
        ...prevFields[name],
        value,
      },
    }));
  };

  const handleInputBlur = (name) => {
    validateField(name, fields[name].value);
    setFields((prevFields) => ({
      ...prevFields,
      [name]: {
        ...prevFields[name],
        touched: true,
      },
    }));
  };

  const validateField = (name, value) => {
    let isValid = true;
    let error = null;

    if (name === "email") {
      isValid = /\S+@\S+\.\S+/.test(value);
      error = isValid ? null : "Введите корректный email";
    } else if (name === "password") {
      isValid = value.length >= 6;
      error = isValid ? null : "Пароль должен содержать минимум 6 символов";
    } else if (name === "confirmPassword") {
      isValid = value === fields.password.value;
      error = isValid ? null : "Пароли не совпадают";
    }

    setFields((prevFields) => ({
      ...prevFields,
      [name]: {
        ...prevFields[name],
        valid: isValid,
        error,
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
                  : `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}`
              }
              onChange={handleInputChange}
              onBlur={() => handleInputBlur(fieldName)}
              className={`${styles.input} ${
                fields[fieldName].error && fields[fieldName].touched
                  ? styles.invalid
                  : ""
              }`}
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
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default App;

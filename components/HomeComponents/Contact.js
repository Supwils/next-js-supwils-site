import { useState } from "react";
import emailjs from "emailjs-com";
import styles from "./Contact.module.css";

const Contact = () =>
{
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    emailSubject: "",
    message: "",
  });

  const [validationMessage, setValidationMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [errors, setErrors] = useState({
    fullName: false,
    email: false,
    message: false
  });

  const handleChange = (e) =>
  {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error state when user types in a field
    if (errors[name])
    {
      setErrors({
        ...errors,
        [name]: false
      });
    }
  };

  const handleSubmit = (e) =>
  {
    e.preventDefault();
    const { fullName, email, message } = formData;
    let hasErrors = false;
    const newErrors = {
      fullName: false,
      email: false,
      message: false
    };

    // Validate required fields
    if (!fullName)
    {
      newErrors.fullName = true;
      hasErrors = true;
    }

    if (!email)
    {
      newErrors.email = true;
      hasErrors = true;
    }

    if (!message)
    {
      newErrors.message = true;
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors)
    {
      // Apply shake animation and return early
      // Set a timeout to clear the error styling after 2 seconds
      setTimeout(() =>
      {
        setErrors({
          fullName: false,
          email: false,
          message: false
        });
      }, 2000);
      return;
    }

    // If validation passes, send the email
    setValidationMessage("");
    // Send email using EmailJS
    emailjs
      .send(
        "service_86jznw1",
        "template_jkvirwl",
        formData,
        "XT0i9ln5UAkdi5Th3"
      )
      .then(
        (response) =>
        {
          // console.log('SUCCESS!', response.status, response.text);
          setValidationMessage("Message sent successfully!");
          setMessageType("success");

          // Reset form
          setFormData({
            fullName: "",
            email: "",
            mobileNumber: "",
            emailSubject: "",
            message: "",
          });

          setTimeout(() =>
          {
            setValidationMessage("");
            setMessageType("");
          }, 3000);
        },
        (err) =>
        {
          // console.log('FAILED...', err);
          setValidationMessage(
            "Failed to send message. Please try again later."
          );
          setMessageType("error");

          setTimeout(() =>
          {
            setValidationMessage("");
            setMessageType("");
          }, 3000);
        }
      );
  };

  return (
    <div className={styles.contact_container}>
      <section className={styles.contact} id="contact">
        <h2 className="heading">
          Contact <span>Me!</span>
        </h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.input_box}>
            <input
              type="text"
              name="fullName"
              placeholder="Name*"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? styles.error_input : ""}
            />
            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.error_input : ""}
            />
          </div>
          <div className={styles.input_box}>
            <input
              type="number"
              name="mobileNumber"
              placeholder="Number"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
            <input
              type="text"
              name="emailSubject"
              placeholder="Subject"
              value={formData.emailSubject}
              onChange={handleChange}
            />
          </div>
          <textarea
            name="message"
            cols="30"
            rows="10"
            placeholder="Your Message*"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? styles.error_input : ""}
          ></textarea>
          <input type="submit" value="Send Message" className="mt-5 pt-5 btn" />
          {validationMessage && (
            <span className={`${styles.validation_message} ${messageType === "success" ? styles.success_message : ""}`}>
              {validationMessage}
            </span>
          )}
        </form>
      </section>
    </div>
  );
};

export default Contact;
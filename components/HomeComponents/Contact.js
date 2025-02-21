import { useState } from "react";
import emailjs from "emailjs-com";
import styles from "./Contact.module.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    emailSubject: "",
    message: "",
  });

  const [validationMessage, setValidationMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, email, message } = formData;

    if (!fullName || !email || !message) {
      setValidationMessage(
        "Please fill in all required fields: Full Name, Email, and Message."
      );
      setTimeout(() => {
        setValidationMessage("");
      }, 3000);
    } else {
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
          (response) => {
            // console.log('SUCCESS!', response.status, response.text);
            setValidationMessage("Message sent successfully!");
            setTimeout(() => {
              setValidationMessage("");
            }, 3000);
          },
          (err) => {
            // console.log('FAILED...', err);
            setValidationMessage(
              "Failed to send message. Please try again later."
            );
            setTimeout(() => {
              setValidationMessage("");
            }, 3000);
          }
        );
    }
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
            />
            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={formData.email}
              onChange={handleChange}
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
          ></textarea>
          <input type="submit" value="Send Message" className="mt-5 pt-5 btn" />
          {validationMessage && (
            <span className={styles.validation_message}>{validationMessage}</span>
          )}
        </form>
      </section>
    </div>
  );
};

export default Contact;
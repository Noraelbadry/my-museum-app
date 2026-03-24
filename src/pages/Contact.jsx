import { useState } from "react";
import emailjs from "emailjs-com";

export default function Contact() {
  const [sending, setSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);
    emailjs
      .sendForm("service_hh1i6f9", "template_quyijwd", e.target, "OSIsRWaopIaFrXV16")
      .then(
        () => { alert("Your message sent successfully! ✨"); e.target.reset(); setSending(false); },
        () => { alert("Failed to send your message, please try again later. ❌"); setSending(false); }
      );
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

    .contact-page {
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 120px 20px 60px;
      box-sizing: border-box;
    }

    .contact-box {
      width: 100%;
      max-width: 520px;
      padding: 52px 44px;
      background: linear-gradient(160deg, rgba(20,15,5,0.95) 0%, rgba(10,8,2,0.98) 100%);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      border-radius: 24px;
      border: 1px solid rgba(212,175,90,0.35);
      box-shadow:
        0 0 0 1px rgba(212,175,90,0.08),
        0 30px 80px rgba(0,0,0,0.8),
        inset 0 1px 0 rgba(212,175,90,0.2),
        inset 0 -1px 0 rgba(212,175,90,0.08);
      display: flex;
      flex-direction: column;
      gap: 28px;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }

    .contact-box::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 60px; height: 60px;
      border-top: 1.5px solid #d4af5a;
      border-left: 1.5px solid #d4af5a;
      border-radius: 24px 0 0 0;
    }

    .contact-box::after {
      content: '';
      position: absolute;
      bottom: 0; right: 0;
      width: 60px; height: 60px;
      border-bottom: 1.5px solid #d4af5a;
      border-right: 1.5px solid #d4af5a;
      border-radius: 0 0 24px 0;
    }

    .contact-header {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .contact-title {
      font-family: 'Cinzel', serif;
      font-size: 2rem;
      font-weight: 700;
      color: transparent;
      background: linear-gradient(180deg, #f5e49c 0%, #d4af5a 50%, #a07830 100%);
      -webkit-background-clip: text;
      background-clip: text;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin: 0;
    }

    .contact-ornament {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .orn-line {
      height: 1px;
      width: 50px;
      background: linear-gradient(to right, transparent, #d4af5a);
    }

    .orn-line.r {
      background: linear-gradient(to left, transparent, #d4af5a);
    }

    .orn-diamond {
      width: 5px; height: 5px;
      background: #d4af5a;
      transform: rotate(45deg);
    }

    .contact-subtitle {
      font-family: 'Lato', sans-serif;
      font-weight: 300;
      font-size: 0.78rem;
      letter-spacing: 0.2em;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      margin: 0;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .input-label {
      font-family: 'Lato', sans-serif;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #d4af5a;
      margin-left: 4px;
    }

    .contact-input {
      padding: 14px 18px;
      border-radius: 10px;
      border: 1px solid rgba(212,175,90,0.15);
      background: rgba(255,255,255,0.03);
      color: #fff;
      outline: none;
      font-size: 16px;
      font-family: 'Lato', sans-serif;
      font-weight: 300;
      transition: border 0.3s ease, background 0.3s ease;
      width: 100%;
      box-sizing: border-box;
    }

    .contact-input:focus {
      border: 1px solid rgba(212,175,90,0.6);
      background: rgba(212,175,90,0.04);
    }

    .contact-input::placeholder { color: rgba(255,255,255,0.2); }

    .contact-btn {
      margin-top: 8px;
      padding: 15px;
      border-radius: 50px;
      border: 1px solid rgba(212,175,90,0.5);
      cursor: pointer;
      background: transparent;
      color: #d4af5a;
      font-family: 'Cinzel', serif;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      transition: all 0.4s ease;
      width: 100%;
    }

    .contact-btn:hover {
      background: linear-gradient(135deg, #d4af5a, #f0d080);
      color: #1a1200;
      border-color: transparent;
      box-shadow: 0 0 30px rgba(212,175,90,0.35);
    }

    @media (max-width: 480px) {
      .contact-box {
        padding: 36px 20px;
        border-radius: 20px;
      }

      .contact-title {
        font-size: 1.6rem;
      }

      .contact-btn {
        font-size: 0.78rem;
        letter-spacing: 0.15em;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="contact-page">
        <div className="contact-box">

          <div className="contact-header">
            <h1 className="contact-title">Contact Us</h1>
            <div className="contact-ornament">
              <div className="orn-line"></div>
              <div className="orn-diamond"></div>
              <div className="orn-line r"></div>
            </div>
            <p className="contact-subtitle">Reach out to the keepers of history</p>
          </div>

          <form className="contact-form" onSubmit={sendEmail}>
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" name="user_name" placeholder="Enter your name" required className="contact-input" />
            </div>

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input type="email" name="user_email" placeholder="Enter your email" required className="contact-input" />
            </div>

            <div className="input-group">
              <label className="input-label">Message</label>
              <textarea name="message" placeholder="Write your message here..." rows="4" required className="contact-input" style={{resize:"none"}}></textarea>
            </div>

            <button type="submit" className="contact-btn">
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>

        </div>
      </div>
    </>
  );
}
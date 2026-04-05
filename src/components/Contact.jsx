import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', query: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.query) return;
    
    // Simulate sending email to the team
    console.log("Email sent to team with query:", formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="contact-container fade-in">
        <div className="success-state">
          <CheckCircle size={64} className="icon-success" />
          <h2>Request Sent!</h2>
          <p>Thank you for reaching out. Our team has received your query and will get back to you shortly via email.</p>
          <button className="btn-primary" onClick={() => setIsSubmitted(false)}>Send Another Query</button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-container fade-in">
      <div className="contact-header">
        <h2>Contact Our Team</h2>
        <p>Have a question that Beru couldn't answer? Fill out the form below and we'll help you out.</p>
      </div>

      <div className="contact-form-wrapper">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-icon-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Your Query</label>
            <div className="input-icon-wrapper textarea-wrapper">
              <MessageSquare size={18} className="input-icon" />
              <textarea 
                placeholder="Please describe how we can help you..."
                rows="5"
                value={formData.query}
                onChange={(e) => setFormData({...formData, query: e.target.value})}
                required
              ></textarea>
            </div>
          </div>

          <button type="submit" className="btn-primary submit-btn">
            <Send size={18} />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission would go here
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <>
      {/* Page Header */}
      <div className="contact-header bg-gradient-to-b from-playzo-dark to-playzo-darker/50 py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-headline font-black text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-playzo-cyan/70 text-lg">
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-12">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-headline font-bold text-white mb-8">Contact Information</h2>

              <div className="card-base p-8 space-y-6">
                <div className="flex gap-4">
                  <div className="text-3xl">📧</div>
                  <div>
                    <h3 className="font-headline font-bold text-white mb-2">Email</h3>
                    <a href="mailto:support@playzo.com" className="text-playzo-pink hover:text-playzo-warm transition-colors">
                      support@playzo.com
                    </a>
                  </div>
                </div>

                <div className="border-t border-playzo-cyan/20" />

                <div className="flex gap-4">
                  <div className="text-3xl">💬</div>
                  <div>
                    <h3 className="font-headline font-bold text-white mb-2">Discord</h3>
                    <a href="#" className="text-playzo-cyan/70 hover:text-playzo-pink transition-colors">
                      Join our Discord community
                    </a>
                  </div>
                </div>

                <div className="border-t border-playzo-cyan/20" />

                <div className="flex gap-4">
                  <div className="text-3xl">🐦</div>
                  <div>
                    <h3 className="font-headline font-bold text-white mb-2">Twitter</h3>
                    <a href="https://twitter.com/playzo_games" target="_blank" rel="noopener noreferrer" className="text-playzo-cyan/70 hover:text-playzo-pink transition-colors">
                      @playzo_games
                    </a>
                  </div>
                </div>

                <div className="border-t border-playzo-cyan/20" />

                <div className="flex gap-4">
                  <div className="text-3xl">🏢</div>
                  <div>
                    <h3 className="font-headline font-bold text-white mb-2">Response Time</h3>
                    <p className="text-playzo-cyan/70">
                      We typically respond to messages within 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="card-base p-8 space-y-6">
                <h2 className="text-2xl font-headline font-bold text-white">Send us a Message</h2>

                {submitted && (
                  <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}

                <div>
                  <label className="block text-playzo-cyan font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-playzo-cyan font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-playzo-cyan font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-playzo-cyan font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary shadow-neon-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 bg-playzo-dark/50">
        <div className="max-w-container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-headline font-bold text-white mb-8">Frequently Asked Questions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: 'Is Playzo free to play?',
                answer: 'Yes! Playzo is completely free. All games are free-to-play with optional in-game cosmetics.',
              },
              {
                question: 'Do I need to create an account?',
                answer: 'No account is required to play games, but creating one lets you save progress and earn rewards.',
              },
              {
                question: 'What if I find a bug?',
                answer: 'Please report bugs to bugs@playzo.com with details and screenshots. We appreciate your help!',
              },
              {
                question: 'How do I submit a game?',
                answer: 'Game submissions are coming soon! Check back for updates on our creator program.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="card-base p-6">
                <h3 className="font-headline font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-playzo-cyan/80">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

import React from "react";

const Contact = () => {
  return (
    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-5xl font-bold text-center text-green-500">
        Contact Us
      </h1>

      <div className="bg-white rounded-3xl shadow-xl p-10 mt-10">

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-3 rounded-xl mb-4"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-xl mb-4"
        />

        <textarea
          rows="5"
          placeholder="Message"
          className="w-full border p-3 rounded-xl"
        />

        <button className="mt-5 bg-green-500 text-white px-6 py-3 rounded-xl">
          Send Message
        </button>

      </div>

    </div>
  );
};

export default Contact;
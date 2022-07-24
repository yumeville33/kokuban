import React from "react";

import { MainButton } from "@/components/Buttons";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted");
  };

  return (
    <section className="py-[100px]">
      <h2 className="text-center text-4xl font-bold text-neutral-800">
        Have some questions?
      </h2>
      <p className="mx-auto mt-3 max-w-[800px] text-center text-neutral-800">
        Thank you for interest in our product. Please fill out the for below or
        email us at <span className="text-sky-600">example@email.com</span> and
        we will get back to you promptly regarding your request.
      </p>
      <div className="mt-12 flex items-center justify-center space-x-12">
        <form action="" className="bg-sky-600 p-8" onSubmit={handleSubmit}>
          <h3 className="text-2xl font-semibold text-white">Contact Us</h3>
          <div className="mt-4 mb-6 h-[5px] w-[100px] bg-white" />
          <div className="space-y-6">
            <div className="flex space-x-3">
              <input
                className="py-2 px-3 outline-none"
                type="text"
                placeholder="First name"
                required
              />
              <input
                className="py-2 px-3 outline-none"
                type="text"
                placeholder="Last name"
              />
            </div>
            <div className="flex space-x-3">
              <input
                className="py-2 px-3 outline-none"
                type="tel"
                placeholder="Phone"
                required
              />
              <input
                className="py-2 px-3 outline-none"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <textarea
              className="w-full py-2 px-3 outline-none"
              cols={30}
              rows={5}
              placeholder="Message"
              required
            />
          </div>
          <MainButton
            text="Send Message"
            type="submit"
            className="mt-5 bg-white"
            textStyle="text-neutral-600"
          />
        </form>
        <div className="space-y-3 text-lg text-neutral-800">
          <div>+12 345 678 90</div>
          <div>example@email.com</div>
          <div>Some address</div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

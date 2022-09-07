import React from "react";

const Accordion = () => {
  const [active, setActive] = React.useState<number | null>(null);

  const item1Ref = React.useRef<HTMLDivElement>(null);
  const item2Ref = React.useRef<HTMLDivElement>(null);

  return (
    <div>
      <div
        className="mx-auto max-w-xl border border-gray-200 bg-white"
        x-data={`{selected:${active}}`}
      >
        <ul className="shadow-box">
          <li className="relative border-b border-gray-200">
            <button
              type="button"
              className="w-full px-8 py-6 text-left"
              onClick={() => {
                setActive(active === 1 ? null : 1);
              }}
            >
              <div className="flex items-center justify-between">
                <span> Should I use reCAPTCHA v2 or v3? </span>
              </div>
            </button>
            <div
              className={`relative max-h-0 overflow-hidden transition-all duration-700 ${
                active === 1
                  ? `max-h-[${item1Ref.current?.scrollHeight}px]`
                  : `max-h-0`
              }`}
              // x-ref="container1"
              ref={item1Ref}
              x-bind:style="selected == 1 ? 'max-height: ' + $refs.container1.scrollHeight + 'px' : ''"
            >
              <div className="p-6">
                <p>
                  reCAPTCHA v2 is not going away! We will continue to fully
                  support and improve security and usability for v2.
                </p>
                <p>
                  reCAPTCHA v3 is intended for power users, site owners that
                  want more data about their traffic, and for use cases in which
                  it is not appropriate to show a challenge to the user.
                </p>
                <p>
                  For example, a registration page might still use reCAPTCHA v2
                  for a higher-friction challenge, whereas more common actions
                  like sign-in, searches, comments, or voting might use
                  reCAPTCHA v3. To see more details, see the reCAPTCHA v3
                  developer guide.
                </p>
              </div>
            </div>
          </li>
          <li className="relative border-b border-gray-200">
            <button
              type="button"
              className="w-full px-8 py-6 text-left"
              onClick={() => {
                setActive(active === 2 ? null : 2);
              }}
            >
              <div className="flex items-center justify-between">
                <span>
                  {" "}
                  I&apos;d like to run automated tests with reCAPTCHA. What
                  should I do?{" "}
                </span>
              </div>
            </button>
            <div
              className={`relative max-h-0 overflow-hidden transition-all duration-700 ${
                active === 1
                  ? `max-h-[${item2Ref.current?.scrollHeight}px]`
                  : `max-h-0`
              }`}
              // x-ref="container2"
              ref={item2Ref}
              x-bind:style="selected == 2 ? 'max-height: ' + $refs.container2.scrollHeight + 'px' : ''"
            >
              <div className="p-6">
                <p>
                  For reCAPTCHA v3, create a separate key for testing
                  environments. Scores may not be accurate as reCAPTCHA v3
                  relies on seeing real traffic.
                </p>
                <p>
                  For reCAPTCHA v2, use the following test keys. You will always
                  get No CAPTCHA and all verification requests will pass.
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Accordion;

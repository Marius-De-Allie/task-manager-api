const sgMail = require('@sendgrid/mail');

// setup send grid api key.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'mariusde_allie@hotmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app ${name}. Let me know how you get along with the app.`
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'mariusde_allie@hotmail.com',
    subject: 'Sorry to see you leave.',
    text: `Goodbye, ${name}. Is there anything we could have done to have kept you onboard?`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};

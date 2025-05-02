
  const brevo = require('@getbrevo/brevo');
  let apiInstance = new brevo.TransactionalEmailsApi();
  

// Function to send verification email
export async function sendAccountCreationEmail(email: string, name: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Welcome to Byose Iwacu Art";
  sendSmtpEmail.htmlContent = `
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome to Our Store</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
            font-size: 17px;
            font-family: sans-serif;
            color: black;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #e74c3c;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }
        .content  a{
            color: white;
        }
        .footer {
            text-align: center;
            padding: 15px;
            background: #ecf0f1;
            font-size: 14px;
            color:grey;
        }
        @media (max-width: 600px) {
            .container {
                width: 90%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
  <div class="header">Welcome to BIA The African Touch!</div>
  <div class="content">
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for creating an account with us! We're thrilled to have you join the BIA family.</p>
    <p>Get ready for an amazing experience filled with authentic Made-in-Rwanda art, fashion, and creativity.</p>
    <a href="www.biafricantouch.com/dash" class="button">Visit your dashboard</a>
  </div>
  <div class="footer">
    Need help? Contact us at <a href="mailto:support@biafricantouch.com">support@biafricantouch.com</a><br>&copy; ${new Date().getFullYear()} BIA Team.
  </div>
</body>
</html>`;
  sendSmtpEmail.sender = { "name": "BIA (Byose Iwacu Art)", "email": "codereveur@gmail.com" };
  sendSmtpEmail.to = [
    { "email": email, "name": name }
  ];
  sendSmtpEmail.replyTo = { "email": "giselumutoni@gmail.com", "name": "Bia Support Team" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
  
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log('Welcome email sent!. ');
  }, function (error: any) {
    console.error(error);
  });
  
}


// Function to send verification email
export async function sendOrderPaymentsEmail( invoiceNumber: number, email: string, payment_status: string, name: string, order_number: string, amount: string, message: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Order Payment Details ";
  sendSmtpEmail.htmlContent = `
<html>
  <head>
    <style>
        body {
        margin: 0;
        padding: 40px;
        display: flex;
        justify-content: center;
      }

      .container {
        font-family: 'Arial', sans-serif;
        background: linear-gradient(135deg, #f8f9fa, #e3e6ec);
        width: 60%;
        margin: auto;
        background: #fff;
        padding: 30px;
        border-radius: 12px;
        border: 2px solid silver;
        text-align: left;
      }

      .header {
        font-size: 26px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
      }

      .order-details {
        text-align: left;
        margin: 20px 0;
        padding: 15px;
        /*background: #f8f9fa;*/
        border-radius: 8px;
        width: 100%;
        margin: auto;
      }

      .order-details p {
        margin: 10px 0;
        font-size: 14px;
        font-weight: 500;
        color: #555;
      }

     .button {
        display: block;
        width: max-content;
        margin: 4px 20px;
        padding: 4px 20px;
        font-size: 14px;
        border-radius: 5px;
        color: #fff;
        text-decoration: none;
        transition: background 0.3s ease-in-out;
        background: #fff4;
      }
       p{
         color: black;
         font-size: 14px;
        }
      
      .status-badge {
        display: inline-block;
        padding: 4px 6px;
        text-align: center;
        border-radius: 8px;
        font-size: 16px;
        color: #fff;
        margin: 0;
      }

      .status-success {
        color: #28a745;
      }

      .status-failed {
        color: #dc3545;
      }

      .status-pending {
        color: #ffc107;
      }
      .button a{
       color: white;
      }
      .button:hover {
        background: #0056b3;
      }

      .footer {
        margin-top: 20px;
        font-size: 14px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Payment Status Update</div>
      <p>Dear <strong>${name}</strong>,</p>
      
      <p>${message}</p>
      <div class="order-details">
        <p>Status:  
          <span class="status-badge ${payment_status === 'Paid' ? 'status-success' : payment_status === 'Failed' ? 'status-failed' : 'status-pending'}"> 
           ${payment_status}
          </span>
        </p>
        <p>Payment link:  <a href='https://checkout.sandbox.irembopay.com/${invoiceNumber}'>https://checkout.sandbox.irembopay.com/${invoiceNumber}</a></p>
        <p>Invoice number:  ${invoiceNumber} <a href='https://checkout.sandbox.irembopay.com/${invoiceNumber}'>Download</a></p>
        <p>Order Number: ${order_number}</p>
        <p>Amount to pay: ${amount}RWF</p>
        <a href="https://biafricantouch.com/dash/orders/${order_number}" class="button">View Order</a>
        <p><strong>Note: </strong> The payment link will be expired in next 24 hours</p>
      </div>
      <div class="footer">
        If you have any questions, feel free to <a href="mailto:support@biafricantouch.com">contact us</a>.
      </div>
    </div>
  </body>
</html>
`;
  sendSmtpEmail.sender = { "name": "Byose Iwacu Art", "email": "clients@biafricantouch.com" };
  sendSmtpEmail.to = [
    { "email": email, "name": name }
  ];
  sendSmtpEmail.replyTo = { "email": "support@biafricantouch.com", "name": "Support Team" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
  
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log('API called successfully. ');
  }, function (error: any) {
    console.error(error.body.message);
  });
  
}

// Function to send verification email
export async function sendAccountVerificationSMS(phone: string): Promise<void> {

let apiInstance = new brevo.TransactionalSMSApi()

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_SMS_API_KEY;

let sendTransacSms = new brevo.SendTransacSms();
sendTransacSms.sender = 'Byose Iwacu Art';
sendTransacSms.recipient = phone;
sendTransacSms.htmlContent = 'Welcome to Byose Iwacu Art';
sendTransacSms.type = 'transactional';
sendTransacSms.webUrl = 'https://biafricantouch.com';

apiInstance.sendTransacSms(sendTransacSms).then(function(data: any) {
  console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function(error: any) {
  console.error(error);
});
}

export async function sendContactUsEmail(
  email: string,
  name: string,
  phone: string,
  message: string
): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  let sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = `New Contact Message from ${name}`;
  sendSmtpEmail.htmlContent = `
  <html>
  <head>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(90deg, #2c3e50, #3498db);
        color: white;
        padding: 20px;
        text-align: center;
        font-size: 22px;
        font-weight: bold;
      }
      .content {
        padding: 20px;
        color: #333333;
        font-size: 16px;
      }
      .info {
        background: #f9f9f9;
        padding: 15px;
        border-radius: 5px;
        margin-top: 15px;
      }
      .info p {
        margin: 5px 0;
      }
      .footer {
        text-align: center;
        padding: 15px;
        background: #ecf0f1;
        font-size: 13px;
        color: #7f8c8d;
      }
      @media (max-width: 600px) {
        .container {
          width: 90%;
        }
      }
    </style>
  <body>
    <div class="container">
      <div class="header">
        📩 New Contact Message
      </div>
      <div class="content">
        <p><strong>Hello BIA Team,</strong></p>
        <p>You have received a new message from the contact form on your website. Here are the details:</p>
        <div class="info">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p style="margin-left:10px; padding-left:10px; border-left:3px solid #3498db;">${message}</p>
        </div>
      </div>
      <div class="footer">
        Need help? Contact us at <a href="mailto:support@biafricantouch.com">support@biafricantouch.com</a><br/>
        &copy; 2025 BIA Team. All rights reserved.
      </div>
    </div>
  </body>
  </html>`;

  sendSmtpEmail.sender = { "name": "Byose Iwacu Art Website", "email": "clients@biafricantouch.com" };
  sendSmtpEmail.to = [
    { "email": "codereveur@gmail.com", "name": "Kamero Dev Team" },
    { "email": "support@biafricantouch.com", "name": "BIA Support Team" }
  ];
  sendSmtpEmail.replyTo = { "email": email, "name": name };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
  
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log('API called successfully. ');
  }, function (error: any) {
    console.error(error.body.message);
  });
}

export async function sendAccountUpdate(email: string, name: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Your BIA Profile Has Been Updated";
  sendSmtpEmail.htmlContent = `
  <html>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
            font-size: 17px;
            font-family: sans-serif;
            color: black;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #e74c3c;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }
        .content  a{
            color: white;
        }
        .footer {
            text-align: center;
            padding: 15px;
            background: #ecf0f1;
            font-size: 14px;
            color:grey;
        }
        @media (max-width: 600px) {
            .container {
                width: 90%;
            }
        }
    </style>
</head>
<body>
<div class="container">
  <div class="header">Profile Update Confirmation</div>
  <div class="content">
    <p>Hello <strong>${name}</strong>,</p>
    <p>We wanted to let you know that your profile was successfully updated.</p>
    <p>If you didn’t make this change, please contact our support team immediately.</p>
    <a href="www.biafricantouch.com/dash" class="button">Review your profile</a>
  </div>
  <div class="footer">
    Questions? <a href="mailto:support@biafricantouch.com">Contact Support</a><br>&copy; 2025 BIA Team.
  </div>
</div>
</body>
</html>`;
  sendSmtpEmail.sender = { "name": "Byose Iwacu Art", "email": "clients@biafricantouch.com" };
  sendSmtpEmail.to = [
    { "email": email, "name": name }
  ];
  sendSmtpEmail.replyTo = { "email": "support@biafricantouch.com", "name": "Bia Support Team" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
  
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log('Welcome email sent!. ');
  }, function (error: any) {
    console.error(error);
  });
  
}

export async function sendAccountPasswordChange(email: string, name: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "Your BIA Password Was Changed";
  sendSmtpEmail.htmlContent = `
  <html>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
            font-size: 17px;
            font-family: sans-serif;
            color: black;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #e74c3c;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }
        .content  a{
            color: white;
        }
        .footer {
            text-align: center;
            padding: 15px;
            background: #ecf0f1;
            font-size: 14px;
            color:grey;
        }
        @media (max-width: 600px) {
            .container {
                width: 90%;
            }
        }
    </style>
</head>
<body>
<div class="container">
  <div class="header">Password Change Notification</div>
  <div class="content">
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your password was successfully changed. If you didn’t request this, please reset your password immediately.</p>
    <a href="www.biafricantouch.com/reset-password" class="button">Reset Password</a>
  </div>
  <div class="footer">
    Need help? <a href="mailto:support@biafricantouch.com">Contact Support</a><br>&copy; 2025 BIA Team.
  </div>
</div>
</body>
</html>`;
  sendSmtpEmail.sender = { "name": "Byose Iwacu Art", "email": "clients@biafricantouch.com" };
  sendSmtpEmail.to = [
    { "email": email, "name": name }
  ];
  sendSmtpEmail.replyTo = { "email": "support@biafricantouch.com", "name": "Bia Support Team" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
  
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log('Welcome email sent!. ');
  }, function (error: any) {
    console.error(error);
  });
  
}

export async function sendActivityEmail(email: string, name: string, message: string, subject: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = `
  <html>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: #2c3e50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
            font-size: 17px;
            font-family: sans-serif;
            color: black;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #e74c3c;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            margin-top: 20px;
        }
        .content  a{
            color: white;
        }
        .footer {
            text-align: center;
            padding: 15px;
            background: #ecf0f1;
            font-size: 14px;
            color:grey;
        }
        @media (max-width: 600px) {
            .container {
                width: 90%;
            }
        }
    </style>
</head>
<body>
<div class="container">
  <div class="header">Account Activity Alert</div>
  <div class="content">
    <p>Hello <strong>${name}</strong>,</p>
    <p>${message}</p>
    <a href="www.biafricantouch.com/dash" class="button">Viisit your dashboard</a>
  </div>
  <div class="footer">
    Questions? <a href="mailto:support@biafricantouch.com">Contact Support</a><br>&copy; 2025 BIA Team.
  </div>
</div>
</body>
</html>`;
  sendSmtpEmail.sender = { "name": "Byose Iwacu Art", "email": "clients@biafricantouch.com" };
  sendSmtpEmail.to = [
    { "email": email, "name": name }
  ];
  sendSmtpEmail.replyTo = { "email": "support@biafricantouch.com", "name": "Bia Support Team" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
  sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };
  
  
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
    console.log('Welcome email sent!. ');
  }, function (error: any) {
    console.error(error);
  });
  
}

export async function sendVerificationCodeEmail(email: string, name: string, verificationCode: string): Promise<void> {
  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  let sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Your Verification Code for Byose Iwacu Art";
  sendSmtpEmail.htmlContent = `
  <div class="container">
    <div class="header">Your Verification Code</div>
    <div class="content">
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your verification code is:</p>
      <h2 style="background: #e74c3c; color: white; display: inline-block; padding: 10px 20px; border-radius: 5px; margin: 20px 0;">${verificationCode}</h2>
      <p>Please enter this code in the app to complete your verification process. This code will expire in 10 minutes.</p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      Need help? Contact us at <a href="mailto:support@biafricantouch.com">support@biafricantouch.com</a><br>&copy; 2025 BIA Team.
    </div>
  </div>`;

  sendSmtpEmail.sender = { "name": "BIA (Byose Iwacu Art)", "email": "codereveur@gmail.com" };
  sendSmtpEmail.to = [{ "email": email, "name": name }];
  sendSmtpEmail.replyTo = { "email": "giselumutoni@gmail.com", "name": "Bia Support Team" };
  sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data: any) {
      console.log('Verification code email sent!');
    },
    function (error: any) {
      console.error(error);
    }
  );
}

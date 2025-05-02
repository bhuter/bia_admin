
const brevo = require('@getbrevo/brevo');
let apiInstance = new brevo.TransactionalEmailsApi();


function formatDate(dateString: any) {
    // Convert the string to a Date object
    const date = new Date(dateString);
  
    // Array of month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    // Extract parts of the date
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  
    // Construct the formatted date
    return `${month}, ${day} ${year} ${hours}:${minutes}:${seconds}`;
  }

// Function to send verification email
export async function sendInvoice( email: string, products: any, name: string, order_number: string, amount: string): Promise<void> {

  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = "New Order Placement and Confirmation details - BIA The African Touch";
  sendSmtpEmail.htmlContent = `
<html>
<head>
 
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .logo {
            width: 40vw;
            height: 40vh;
        }
        .content {
            font-size: 14px;
            color: #333;
            line-height: 1.6;
        }
        .order-details {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .table th {
            background: #d4af37;
            color: white;
        }
        .button {
            display: inline-block;
            background: silver;
            color: white;
            padding: 4px 15px;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>

<div class="container">
    <!-- Header with Logo -->
    <div class="header">
        <img src="https://bia-tawny.vercel.app/_next/image?url=%2Fimgs%2Flogo.ico&w=64&q=75" alt="BIA Logo" class="logo">
    </div>

    <!-- Email Content -->
    <div class="content">
        <p>Dear ${name},</p>

        <p>Thank you for shopping with <strong>BIA - The African Touch</strong>. Your order has been successfully placed on <strong>${formatDate(new Date())}</strong>.</p>
        
        <div class="order-details">
            <p><strong>Order #:</strong> ${order_number}</p>
            <p><strong>Total Amount:</strong> ${amount} RWF</p>
            <p><strong>Estimated Delivery:</strong> 1-3 Business Days</p>
            <p><strong>Date:</strong> ${formatDate(new Date())}</p>
        </div>

        <p><strong>Order Items</strong></p>
        <table class="table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                ${products.map((item: any, i: number) => (
                 `<tr key='${i}'>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit_price}</td>
                    </tr>
                 `
                ))}
            </tbody>
        </table>

        <p><strong>Subtotal:</strong> ${amount} RWF</p>
        <p><strong>Others:</strong> 0 RWF</p>
        <p><strong>Grand Total:</strong> ${amount} RWF</p>
        <p>You can track your order and view the delivery details through the link: <a href="https://biafricantouch.com/dash/orders/${order_number}">https://biafricantouch.com/dash/orders/${order_number}</a></p>
        <p><a href="https://biafricantouch.com/dash/orders/${order_number}" class="button">View Order</a></p>

        <p>---</p>
        <p>Regards,</p>
        <p><strong>BIA - The African Touch</strong></p>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p><a href="https://biafricantouch.com">Visit our website</a> | <a href="https://biafricantouch.com/auth/login">Log in to your account</a> | <a href="mailto:giselumutoni@gmail.com">Get support</a></p>
        <p>${new Date().getFullYear()} Copyright © BIA - The African Touch, All rights reserved.</p>
    </div>
</div>

</body>
</html>`;
sendSmtpEmail.sender = { "name": "BIA(Byose Iwacu Art)", "email": "codereveur@gmail.com" };
sendSmtpEmail.to = [
  { "email": email, "name": name },
  { "email": "hacketrich@gmail.com", "name": "Commercial Officer" },
];
sendSmtpEmail.replyTo = { "email": "giselumutoni@gmail.com", "name": "Bia Support Team" };
sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
sendSmtpEmail.params = { "parameter": "My param value", "subject": "common subject" };


apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data: any) {
  console.log('Invoice sent!. ');
}, function (error: any) {
  console.error(error);
});

}

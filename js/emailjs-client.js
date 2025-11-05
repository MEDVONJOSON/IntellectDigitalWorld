(function(){
  // Using Web3Forms - Simple email service
  // Access key from: https://web3forms.com/
  var WEB3FORMS_ACCESS_KEY = '3212dd48-f0c1-413e-b7fe-f0d8d3cae703';
  var ADMIN_EMAIL = 'medvonjoson@gmail.com'; // Email that receives notifications

  window.sendMasterclassEmail = async function(data){
    if (WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      throw new Error('Web3Forms not configured. Get free key from https://web3forms.com/');
    }

    // Build email content
    var emailBody = `
Dear ${data.name},

Thank you for registering for ${data.masterclass || data.program || 'our Masterclass'}!

Registration Details:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
- Location: ${data.location || 'Not provided'}
- Training Mode: ${data.trainingMode || 'Not specified'}
- Schedule: ${data.schedule || 'Not provided'}
- Additional Notes: ${data.notes || 'None'}

${data.trainingMode && data.trainingMode.includes('Online') ? 'You will receive a virtual meeting link (Zoom/Google Meet) before the class starts.' : 'We will contact you soon with the venue location and exact time.'}

We will send you the full curriculum and additional details shortly.

Best regards,
Intellect Digital World (Techlink us)
    `.trim();

    // Send to student
    var formData = new FormData();
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('subject', 'Masterclass Registration Confirmation - ' + (data.masterclass || data.program || 'Training'));
    formData.append('from_name', 'Intellect Digital World');
    formData.append('email', data.email); // Student receives email
    formData.append('message', emailBody);

    var response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Email sending failed');
    }

    // Also notify admin
    var adminFormData = new FormData();
    adminFormData.append('access_key', WEB3FORMS_ACCESS_KEY);
    adminFormData.append('subject', 'New Masterclass Registration: ' + data.name);
    adminFormData.append('from_name', 'Masterclass Registration System');
    adminFormData.append('email', ADMIN_EMAIL);
    adminFormData.append('message', `New registration received:\n\n${emailBody}`);

    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: adminFormData
    });

    return response.json();
  };
})();

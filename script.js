// Dynamic Configuration - Protected via Vercel Environment Variables

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const successMsg = document.getElementById('success-message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Grab form elements
            const nameInput = form.querySelector('input[name="name"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            const emailInput = form.querySelector('input[name="email"]');
            const serviceSelect = form.querySelector('select[name="service"]');
            const submitButton = form.querySelector('button[type="submit"]');

            if (!nameInput || !phoneInput || !emailInput || !serviceSelect) {
                return;
            }

            // 2. Extract values
            const nameValue = nameInput.value.trim();
            const phoneValue = phoneInput.value.trim();
            const emailValue = emailInput.value.trim();
            const serviceValue = serviceSelect.value;

            // 3. Strict Front-End Validation Catch Rules
            const phoneRegex = /^[0-9]{10}$/;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!phoneRegex.test(phoneValue)) {
                alert('Please enter a valid 10-digit phone number.');
                phoneInput.focus();
                return;
            }

            if (!emailRegex.test(emailValue)) {
                alert('Please enter a valid email address with a domain extension (e.g., .com, .ca).');
                emailInput.focus();
                return;
            }

            // 4. Proceed with submission if validated
            const fullPhoneNumber = `+1 ${phoneValue}`;

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerText = 'Sending...';
            }

            try {
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        full_name: nameValue,
                        phone_number: fullPhoneNumber,
                        email: emailValue,
                        service: serviceValue
                    })
                });

                if (response.ok) {
                    // Show our beautiful design success message container
                    if (successMsg) {
                        successMsg.classList.remove('hidden');
                    }
                    // Reset the form fields automatically
                    form.reset();
                } else {
                    const errorText = await response.text();
                    console.error('Supabase Error:', errorText);
                    alert('Database rejected submission. Check console logs.');
                }
            } catch (err) {
                console.error('Network error:', err);
                alert('Connection failure.');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerText = 'Request Free Quote';
                }
            }
        });
    }
});
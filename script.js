// Supabase Configuration Credentials

const SUPABASE_URL = 'https://hlzmugdzyorhbljpqslt.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_56RJDPCv7klUhUEaOzfdlg_xz87Q2SV';

// Wait for the HTML page to fully load before running our code
document.addEventListener('DOMContentLoaded', () => {
    // Find our lead form on the page using its class or ID
    const form = document.querySelector('form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            // Prevent the standard browser page refresh on submit
            e.preventDefault();

            // Grab the exact text values the user typed into the inputs
            // (Note: Make sure your HTML input elements have name="name" and name="phone")
            const nameInput = form.querySelector('input[name="name"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            const submitButton = form.querySelector('button[type="submit"]');

            if (!nameInput || !phoneInput) {
                alert('Error: Make sure your HTML inputs have name="name" and name="phone" attributes!');
                return;
            }

            const nameValue = nameInput.value;
            const phoneValue = phoneInput.value;

            // Visual feedback: disable button while saving
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerText = 'Sending...';
            }

            try {
                // Shoot the data straight to your Supabase REST API endpoint
                const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        name: nameValue,
                        phone: phoneValue
                    })
                });

                if (response.ok) {
                    alert('Success! Lead saved to the database vault.');
                    form.reset(); // Clear out the input fields
                } else {
                    const errorText = await response.text();
                    console.error('Supabase Error details:', errorText);
                    alert('Database rejected submission. Check console logs.');
                }
            } catch (err) {
                console.error('Network error:', err);
                alert('Connection failure. Check internet or API credentials.');
            } finally {
                // Reset button appearance
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerText = 'Submit';
                }
            }
        });
    }
});
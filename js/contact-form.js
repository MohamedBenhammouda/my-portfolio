// contact-form.js

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const contactMessage = document.getElementById("contactMessage");

  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();       // Prevent default page reload
    e.stopPropagation();      // Stop other click/submit events

    // Gather form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      // Send data to your server
      const res = await fetch(contactForm.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        contactMessage.textContent = "✅ Message sent successfully!";
        contactForm.reset();
      } else {
        contactMessage.textContent = `❌ Error: ${result.error || "Something went wrong."}`;
      }

    } catch (err) {
      console.error("Form submission error:", err);
      contactMessage.textContent = "❌ Could not send message. Server error.";
    }
  });
});
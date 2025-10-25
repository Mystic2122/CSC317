// switcher.js

// Function to switch between stylesheets
function switchStyle(sheetName) {
  // Find the <link> element with rel="stylesheet" and id="pagestyle"
  const link = document.getElementById("pagestyle");

  if (!link) {
    console.error("No <link> element with id='pagestyle' found.");
    return;
  }

  // Change the href to the new stylesheet
  link.setAttribute("href", sheetName);

  // Optional: Save the user's choice in localStorage
  localStorage.setItem("preferredStyle", sheetName);
}

// Automatically load saved style on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedStyle = localStorage.getItem("preferredStyle");
  if (savedStyle) {
    const link = document.getElementById("pagestyle");
    if (link) {
      link.setAttribute("href", savedStyle);
    }
  }
});

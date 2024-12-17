const passwordOutput = document.getElementById("password");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const saveBtn = document.getElementById("saveBtn");
const exportBtn = document.getElementById("exportBtn"); // New Export Button
const lengthInput = document.getElementById("length");
const includeNumbers = document.getElementById("includeNumbers");
const includeSymbols = document.getElementById("includeSymbols");
const excludeSimilar = document.getElementById("excludeSimilar");
const strengthIndicator = document.getElementById("strengthIndicator");
const passwordList = document.getElementById("passwordList");
const themeToggle = document.getElementById("themeToggle");
const reasonInput = document.getElementById("reason");

// Set Dark Mode as Default
document.body.classList.add("dark-mode");
document.querySelector(".container").classList.add("dark-mode");
themeToggle.innerText = "White Mode";

// Character Sets
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$_*"; // Limited symbols
const similarChars = /[oO0l1]/g;

// Generate Password
function generatePassword() {
    let charset = letters;
    const length = parseInt(lengthInput.value);

    if (excludeSimilar.checked) {
        charset = charset.replace(similarChars, "");
    }

    let password = "";
    let mandatorySymbols = ""; // To force the inclusion of symbols
    let mandatoryNumbers = ""; // To force the inclusion of numbers

    // Force symbol if checkbox is checked
    if (includeSymbols.checked) {
        mandatorySymbols = symbols[Math.floor(Math.random() * symbols.length)];
    }

    // Force number if checkbox is checked
    if (includeNumbers.checked) {
        mandatoryNumbers = numbers[Math.floor(Math.random() * numbers.length)];
    }

    // Build the initial password
    let combinedCharset = charset + (includeNumbers.checked ? numbers : "") + (includeSymbols.checked ? symbols : "");

    for (let i = password.length; i < length - mandatorySymbols.length - mandatoryNumbers.length; i++) {
        password += combinedCharset.charAt(Math.floor(Math.random() * combinedCharset.length));
    }

    password = mandatoryNumbers + password + mandatorySymbols;
    password = password.split('').sort(() => 0.5 - Math.random()).join(''); // Shuffle the characters

    passwordOutput.value = password;
    updateStrengthIndicator(password);
}

// Copy Password to Clipboard
copyBtn.addEventListener("click", () => {
    passwordOutput.select();
    document.execCommand("copy");
});

// Save Password to List
saveBtn.addEventListener("click", () => {
    const reason = reasonInput.value || "No reason provided"; // Get reason if available, else default message
    const li = document.createElement("li");
    li.textContent = `${passwordOutput.value} (Reason: ${reason})`; // Display password with reason
    li.setAttribute("data-reason", reason); // Store reason as data attribute
    passwordList.appendChild(li);
    reasonInput.value = ""; // Clear reason after saving
});

// Export Password to .txt file
exportBtn.addEventListener("click", () => {
    const savedPasswords = document.querySelectorAll("#passwordList li");
    let exportText = "Saved Passwords:\n\n";

    savedPasswords.forEach((li) => {
        const password = li.textContent.split(" (Reason:")[0];
        const reason = li.getAttribute("data-reason");
        exportText += `${password} (Reason: ${reason})\n`;
    });

    const blob = new Blob([exportText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "saved_passwords.txt";
    link.click();
});

// Update Strength Indicator
function updateStrengthIndicator(password) {
    const strength = password.length;
    let strengthText = "Weak";

    if (strength >= 16) {
        strengthText = "Strong";
    } else if (strength >= 10) {
        strengthText = "Medium";
    }

    strengthIndicator.textContent = `Strength: ${strengthText}`;
}

// Handle Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.querySelector(".container").classList.toggle("dark-mode");
    themeToggle.innerText = document.body.classList.contains("dark-mode") ? "White Mode" : "Dark Mode";
});

// Event Listeners for Generating Password
generateBtn.addEventListener("click", generatePassword);
lengthInput.addEventListener("input", generatePassword);
includeNumbers.addEventListener("change", generatePassword);
includeSymbols.addEventListener("change", generatePassword);
excludeSimilar.addEventListener("change", generatePassword);

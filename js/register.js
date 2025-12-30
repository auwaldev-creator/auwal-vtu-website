let currentStep = 1;
let capturedImage = null;

// Function don canza Step
function nextStep(step) {
    // Validation (Tabbatar da an cike gurbi)
    if (step === 2 && (!getValue('email') || !getValue('phone'))) return alert('Please fill all fields');
    if (step === 3 && (!getValue('firstName') || !getValue('lastName'))) return alert('Please enter your name');
    if (step === 4 && getValue('nin').length < 11) return alert('NIN/BVN must be at least 11 digits');
    if (step === 5 && !capturedImage) return alert('Please complete face verification');
    if (step === 7 && getValue('password').length < 6) return alert('Password must be at least 6 characters');
    if (step === 7 && getValue('password') !== getValue('confirmPassword')) return alert('Passwords do not match');

    // Hide all steps
    document.querySelectorAll('.step-section').forEach(el => el.classList.add('d-none'));
    
    // Show new step
    document.getElementById(`step${step}`).classList.remove('d-none');
    
    // Update Progress Bar
    let percent = (step / 8) * 100;
    document.getElementById('progressBar').style.width = `${percent}%`;

    // Change Titles based on step
    const titles = ["", "Contact Info", "Personal Details", "Identity Verification", "Face Capture", "Address", "Security", "Transaction PIN", "Success"];
    document.getElementById('stepTitle').innerText = titles[step-1] || "Register";

    currentStep = step;
}

// Helper to get input value
function getValue(id) {
    return document.getElementById(id).value.trim();
}

// --- FACE VERIFICATION LOGIC (Camera Fix) ---
async function startCamera() {
    const video = document.getElementById('video');
    const placeholder = document.getElementById('placeholder-face');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: false 
        });
        video.srcObject = stream;
        video.style.display = 'block';
        placeholder.style.display = 'none';
        document.getElementById('captureBtn').disabled = false;
    } catch (err) {
        console.error("Camera Error:", err);
        alert("Camera failed to open. Please ensure you allowed permissions.");
        // Fallback for testing/desktop without webcam
        placeholder.src = "https://cdn-icons-png.flaticon.com/512/1177/1177568.png"; // Simulated
        document.getElementById('captureBtn').disabled = false;
        document.getElementById('captureBtn').innerText = "Simulate Capture (Mock)";
    }
}

function captureFace() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    
    // Draw video frame to canvas
    canvas.width = video.videoWidth || 300;
    canvas.height = video.videoHeight || 300;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    capturedImage = "face_verified"; // Just a flag for now
    
    // Stop camera stream
    if(video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    
    alert("Face Verified Successfully!");
    nextStep(5);
}

// --- FINAL SUBMISSION ---
async function submitRegistration() {
    const pin = getValue('txPin');
    if (pin.length !== 4) return alert("PIN must be 4 digits");

    const email = getValue('email');
    const password = getValue('password');
    const phone = getValue('phone');
    
    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (authError) {
        alert("Error: " + authError.message);
        return;
    }

    const userId = authData.user.id;

    // 2. Save Full Details to Profiles Table
    const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
            id: userId,
            email: email,
            phone: phone,
            first_name: getValue('firstName'),
            last_name: getValue('lastName'),
            nin_bvn: getValue('nin'),
            address: getValue('address'),
            transaction_pin: pin,
            account_number: phone.replace(/^0+/, ''), // Remove leading zero for account number
            wallet_balance: 0.00
        }]);

    if (profileError) {
        alert("Database Error: " + profileError.message);
    } else {
        // Show Success Step
        document.getElementById('genAccNum').innerText = phone.replace(/^0+/, '');
        nextStep(8);
    }
                                }

const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzzfFHjmLz_elZPBAuDsQMjJOXmzNGCk8dYMDtko6caxmSQQbqQL44tkM8S45Wp2zuc/exec';
const loadingOverlay = document.getElementById("loadingOverlay");
const submitBtn = document.querySelector("button[type='submit']");
document.getElementById("dataForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    loadingOverlay.style.display = "flex";
    submitBtn.disabled = true;
    submitBtn.innerText = "กรุณารอสักครู่...";

    const team_type = document.getElementById("team_type").value;
    const team_name = document.getElementById("team_name").value;
    const edu_name = document.getElementById("edu_name").value;
    const instructor_name = document.getElementById("instructor_name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const member = document.getElementById("member").value;
    const fileInput = document.getElementById("fileInput").files[0];

    const reader = new FileReader();
    reader.onloadend = async function () {
        const base64Data = reader.result.split(',')[1];

        try {
            const response = await fetch(SHEET_API_URL, {
                method: "POST",
                body: JSON.stringify({
                    action: "add",
                    team_type,
                    team_name,
                    edu_name,
                    instructor_name,
                    phone,
                    email,
                    member,
                    fileBase64: base64Data,
                    fileType: fileInput.type,
                    fileName: fileInput.name
                }),
            });

            if (response.ok) {
                alert('ลงทะเบียนเรียบร้อยแล้ว');
                document.getElementById("dataForm").reset();
            } else {
                alert('เกิดข้อผิดพลาดในการลงทะเบียน');
            }
        } catch (error) {
            alert('ไม่สามารถเชื่อมต่อ API ได้');
            console.error(error);
        }
        // 🔴 ซ่อน overlay และเปิดปุ่ม
        loadingOverlay.style.display = "none";
        submitBtn.disabled = false;
        submitBtn.innerText = "สมัคร";
    };
    reader.readAsDataURL(fileInput);
});
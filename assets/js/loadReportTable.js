const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzzfFHjmLz_elZPBAuDsQMjJOXmzNGCk8dYMDtko6caxmSQQbqQL44tkM8S45Wp2zuc/exec';
// ดึงค่า level จาก URL เช่น ?level=มัธยมต้น
const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get("level");

if (level) {
    loadTable(level);
} else {
    alert("ไม่พบ parameter level ใน URL");
}

async function loadTable(level) {
    const response = await fetch(SHEET_API_URL, {
        method: "POST",
        body: JSON.stringify({
            action: "list",
            level: level
        }),
    });

    const data = await response.json();
    const table = document.getElementById("reportTable");
    table.innerHTML = "";

    data.forEach((row, index) => {
        const members = row[4].replace(/\n/g, "<br>");
        table.innerHTML += `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td>${row[1]}</td>
        <td>${row[2]}<br><span class="text-xs">${row[3]}</span></td>
        <td>${row[5]}</td>
      </tr>`;
    });
}

function showMembers(content) {
    const lines = content.split(/\n+/).filter(line => line.trim() !== "");
    const listItems = lines.map(name => `<li>${name.trim()}</li>`).join("");
    document.getElementById("memberModalBody").innerHTML = `<ol>${listItems}</ol>`;

    const modal = new bootstrap.Modal(document.getElementById('memberModal'));
    modal.show();
}

async function deleteRow(index) {
    if (!confirm("ยืนยันการลบ?")) return;
    await fetch(SHEET_API_URL, {
        method: "POST",
        body: JSON.stringify({action: "delete", rowIndex: index}),
    });
    loadTable(level);
}

document.getElementById("searchInput").addEventListener("keyup", function () {
    const val = this.value.toLowerCase();
    const rows = document.querySelectorAll("#reportTable tr");
    rows.forEach(row => {
        const match = row.innerText.toLowerCase().includes(val);
        row.style.display = match ? "" : "none";
    });
});

window.onload = loadTable(level);
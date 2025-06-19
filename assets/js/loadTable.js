const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzzfFHjmLz_elZPBAuDsQMjJOXmzNGCk8dYMDtko6caxmSQQbqQL44tkM8S45Wp2zuc/exec';

async function loadTable() {
    const response = await fetch(SHEET_API_URL, {
        method: "POST",
        body: JSON.stringify({action: "list"}),
    });

    const data = await response.json();
    console.log("DATA FROM API:", data);
    const table = document.getElementById("dataTable");
    table.innerHTML = "";
    data.forEach((row, index) => {
        const members = row[4].replace(/\n/g, "<br>"); // เปลี่ยนบรรทัดใหม่เป็น <br>
        table.innerHTML += `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td>${row[1]}</td>
        <td class="text-center">${row[2]}<br><span class="text-xs">${row[3]}</span></td>
        <td><button class="btn btn-info btn-sm" onclick="showMembers(\`${row[4]}\`)">ดูรายชื่อ</button></td>
        <td>${row[5]}<br><span class="text-xs">${row[6]}</span></td>
        <td>${row[7]}</td>
        <td class="text-center"><a class="btn btn-sm btn-primary" href="${row[8]}" target="_blank">ดูไฟล์</a></td>
        <td><button class="btn btn-danger btn-sm" onclick="deleteRow(${index})">ลบ</button></td>
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
    loadTable();
}

document.getElementById("searchInput").addEventListener("keyup", function () {
    const val = this.value.toLowerCase();
    const rows = document.querySelectorAll("#dataTable tr");
    rows.forEach(row => {
        const match = row.innerText.toLowerCase().includes(val);
        row.style.display = match ? "" : "none";
    });
});

window.onload = loadTable();
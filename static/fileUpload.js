document.getElementById("plyFileInput").onchange = function() {
    document.getElementById("plyUploadFile").value = this.files[0].name;
};

document.getElementById("jsonFileInput").onchange = function() {
    document.getElementById("jsonUploadFile").value = this.files[0].name;
};  
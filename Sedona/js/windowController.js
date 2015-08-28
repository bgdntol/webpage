		document.getElementById('buttonId').addEventListener('click', function(e) {
        e.preventDefault();
        console.log("ddddddd");
        var modalClass = 'modal-content';
        var modals = document.getElementsByClassName(modalClass);
        var yourModal = modals[0];
        yourModal.style.display = (yourModal.style.display == 'none' || yourModal.style.display == '') ? 'block' : 'none';
    });

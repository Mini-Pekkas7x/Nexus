document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    if (!menuToggle || !sidebar) return;

    // Abrir / fechar menu
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");

        if (overlay) {
            overlay.classList.toggle("active");
        }
    });

    // Fechar clicando no overlay
    if (overlay) {
        overlay.addEventListener("click", () => {
            sidebar.classList.remove("open");
            overlay.classList.remove("active");
        });
    }

    // Fechar ao clicar em um item do menu
    const menuItems = sidebar.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            sidebar.classList.remove("open");

            if (overlay) {
                overlay.classList.remove("active");
            }
        });
    });

});
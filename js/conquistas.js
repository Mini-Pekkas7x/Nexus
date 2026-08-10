console.log("NEXUS — Conquistas iniciado!");


// =============================
// ELEMENTOS
// =============================

const newAchievementButton =
    document.getElementById("new-achievement-button");

const modal =
    document.getElementById("achievement-modal");

const closeModal =
    document.getElementById("close-achievement-modal");

const cancelAchievement =
    document.getElementById("cancel-achievement");

const achievementForm =
    document.getElementById("achievement-form");

const achievementsContainer =
    document.getElementById("achievements-container");

const searchAchievements =
    document.getElementById("search-achievements");

const filterCategory =
    document.getElementById("filter-achievement-category");


// =============================
// DADOS
// =============================

let achievements =
    NexusStorage.buscar("conquistas");


// =============================
// ABRIR MODAL
// =============================

newAchievementButton.addEventListener(
    "click",
    function () {

        document.getElementById(
            "achievement-modal-title"
        ).textContent = "Nova conquista";

        achievementForm.reset();

        document.getElementById(
            "achievement-id"
        ).value = "";

        // Coloca a data de hoje
        document.getElementById(
            "achievement-date"
        ).value =
            new Date()
                .toISOString()
                .split("T")[0];

        modal.classList.remove("hidden");

    }
);


// =============================
// FECHAR MODAL
// =============================

closeModal.addEventListener(
    "click",
    function () {

        modal.classList.add("hidden");

    }
);


cancelAchievement.addEventListener(
    "click",
    function () {

        modal.classList.add("hidden");

    }
);


// =============================
// SALVAR
// =============================

achievementForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "achievement-id"
            ).value;


        const title =
            document.getElementById(
                "achievement-title"
            ).value.trim();


        const category =
            document.getElementById(
                "achievement-category"
            ).value;


        const date =
            document.getElementById(
                "achievement-date"
            ).value;


        const description =
            document.getElementById(
                "achievement-description"
            ).value.trim();


        if (
            !title ||
            !date ||
            !description
        ) {

            alert(
                "Preencha todos os campos."
            );

            return;

        }


        // =============================
        // EDITAR
        // =============================

        if (id) {

            const achievement =
                achievements.find(
                    function (achievement) {

                        return achievement.id === id;

                    }
                );


            if (achievement) {

                achievement.title =
                    title;

                achievement.category =
                    category;

                achievement.date =
                    date;

                achievement.description =
                    description;

                achievement.updatedAt =
                    new Date().toISOString();

            }

        }


        // =============================
        // CRIAR
        // =============================

        else {

            const newAchievement = {

                id:
                    crypto.randomUUID(),

                title:
                    title,

                category:
                    category,

                date:
                    date,

                description:
                    description,

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            };


            achievements.unshift(
                newAchievement
            );

        }


        // =============================
        // SALVAR
        // =============================

        NexusStorage.salvar(
            "conquistas",
            achievements
        );


        achievementForm.reset();

        document.getElementById(
            "achievement-id"
        ).value = "";


        modal.classList.add("hidden");


        renderAchievements();

    }
);


// =============================
// RENDERIZAR
// =============================

function renderAchievements() {

    const search =
        searchAchievements.value
            .toLowerCase()
            .trim();


    const category =
        filterCategory.value;


    let filteredAchievements =
        achievements.filter(
            function (achievement) {

                const matchesSearch =
                    achievement.title
                        .toLowerCase()
                        .includes(search)
                    ||
                    achievement.description
                        .toLowerCase()
                        .includes(search);


                const matchesCategory =
                    category === "all"
                    ||
                    achievement.category === category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    // Mais recentes primeiro

    filteredAchievements.sort(
        function (a, b) {

            const dateA =
                new Date(
                    a.updatedAt ||
                    a.createdAt
                );

            const dateB =
                new Date(
                    b.updatedAt ||
                    b.createdAt
                );

            return dateB - dateA;

        }
    );


    achievementsContainer.innerHTML = "";


    // =============================
    // NENHUMA CONQUISTA
    // =============================

    if (
        filteredAchievements.length === 0
    ) {

        achievementsContainer.innerHTML = `

            <div class="achievement-empty">

                <div>
                    🏆
                </div>

                <h3>
                    Nenhuma conquista encontrada
                </h3>

                <p>
                    Crie uma conquista ou tente outra pesquisa.
                </p>

            </div>

        `;

        return;

    }


    // =============================
    // CARDS
    // =============================

    filteredAchievements.forEach(
        function (achievement) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "achievement-card";


            card.innerHTML = `

                <div class="achievement-icon">
                    🏆
                </div>


                <h3>
                    ${escapeHTML(
                        achievement.title
                    )}
                </h3>


                <span class="achievement-category">
                    ${escapeHTML(
                        achievement.category
                    )}
                </span>


                <p class="achievement-description">
                    ${escapeHTML(
                        achievement.description
                    )}
                </p>


                <div class="achievement-footer">

                    <span>
                        📅
                        ${formatDate(
                            achievement.date
                        )}
                    </span>


                    <div class="achievement-actions">

                        <button
                            onclick="editAchievement('${achievement.id}')"
                            title="Editar"
                        >
                            ✏️
                        </button>


                        <button
                            onclick="deleteAchievement('${achievement.id}')"
                            title="Excluir"
                        >
                            🗑️
                        </button>

                    </div>

                </div>

            `;


            achievementsContainer.appendChild(
                card
            );

        }
    );

}


// =============================
// EDITAR
// =============================

function editAchievement(id) {

    const achievement =
        achievements.find(
            function (achievement) {

                return achievement.id === id;

            }
        );


    if (!achievement) return;


    document.getElementById(
        "achievement-modal-title"
    ).textContent =
        "Editar conquista";


    document.getElementById(
        "achievement-id"
    ).value =
        achievement.id;


    document.getElementById(
        "achievement-title"
    ).value =
        achievement.title;


    document.getElementById(
        "achievement-category"
    ).value =
        achievement.category;


    document.getElementById(
        "achievement-date"
    ).value =
        achievement.date;


    document.getElementById(
        "achievement-description"
    ).value =
        achievement.description;


    modal.classList.remove("hidden");

}


// =============================
// EXCLUIR
// =============================

function deleteAchievement(id) {

    const confirmDelete =
        confirm(
            "Deseja realmente excluir esta conquista?"
        );


    if (!confirmDelete) return;


    achievements =
        achievements.filter(
            function (achievement) {

                return achievement.id !== id;

            }
        );


    NexusStorage.salvar(
        "conquistas",
        achievements
    );


    renderAchievements();

}


// =============================
// PESQUISA
// =============================

searchAchievements.addEventListener(
    "input",
    renderAchievements
);


filterCategory.addEventListener(
    "change",
    renderAchievements
);


// =============================
// UTILIDADES
// =============================

function formatDate(date) {

    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "pt-BR"
    );

}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// =============================
// INICIAR
// =============================

renderAchievements();

// =============================
// ABRIR MODAL PELO DASHBOARD
// =============================

const params =
    new URLSearchParams(
        window.location.search
    );


if (params.get("novo") === "true") {

    const newAchievementButton =
        document.getElementById(
            "new-achievement-button"
        );


    if (newAchievementButton) {

        newAchievementButton.click();

    }

}